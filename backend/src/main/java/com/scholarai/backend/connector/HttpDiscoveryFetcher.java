package com.scholarai.backend.connector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.net.ssl.SSLHandshakeException;
import javax.net.ssl.SSLPeerUnverifiedException;
import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.net.http.HttpClient;
import java.net.http.HttpConnectTimeoutException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.security.cert.CertificateException;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Safe, robust HTTP discovery fetcher with SSRF protection, bounded pagination,
 * error categorization, and resilient HTML/JSON extraction.
 */
@Component
public class HttpDiscoveryFetcher {

    private static final Logger log = LoggerFactory.getLogger(HttpDiscoveryFetcher.class);

    private final HttpClient httpClient;

    public static class FetchResult {
        public final boolean success;
        public final int statusCode;
        public final String body;
        public final String errorCategory;
        public final String errorMessage;

        public FetchResult(boolean success, int statusCode, String body, String errorCategory, String errorMessage) {
            this.success = success;
            this.statusCode = statusCode;
            this.body = body;
            this.errorCategory = errorCategory;
            this.errorMessage = errorMessage;
        }
    }

    public HttpDiscoveryFetcher() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(8))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    /**
     * Checks if the host resolves to a private, loopback, or unsafe IP address (SSRF Protection).
     */
    public boolean isSafeUrl(String url) {
        if (url == null || url.isBlank()) return false;
        try {
            URI uri = URI.create(url.trim());
            String host = uri.getHost();
            if (host == null || host.isBlank()) return false;

            String scheme = uri.getScheme();
            if (!"https".equalsIgnoreCase(scheme) && !"http".equalsIgnoreCase(scheme)) return false;

            if ("localhost".equalsIgnoreCase(host) || host.endsWith(".local") || host.endsWith(".internal")) {
                return false;
            }

            InetAddress[] addresses = InetAddress.getAllByName(host);
            for (InetAddress addr : addresses) {
                if (addr.isLoopbackAddress() || addr.isSiteLocalAddress() || addr.isLinkLocalAddress() || addr.isAnyLocalAddress()) {
                    return false;
                }
                String ip = addr.getHostAddress();
                if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.16.") ||
                    ip.startsWith("172.17.") || ip.startsWith("172.18.") || ip.startsWith("172.19.") ||
                    ip.startsWith("172.2") || ip.startsWith("172.3") || ip.startsWith("127.") || ip.startsWith("169.254.")) {
                    return false;
                }
            }
            return true;
        } catch (UnknownHostException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Executes an authenticated, safe HTTP GET request with retries on transient errors.
     */
    public FetchResult safeFetch(String url) {
        if (!isSafeUrl(url)) {
            return new FetchResult(false, 0, null, "INVALID_URL", "URL failed security validation or resolved to an unsafe address: " + url);
        }

        int maxAttempts = 2;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url.trim()))
                        .timeout(Duration.ofSeconds(10))
                        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (ScholarAI Official Discovery Crawler/1.0)")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7")
                        .header("Accept-Language", "en-US,en;q=0.9,hi;q=0.8")
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                int code = response.statusCode();

                if (code >= 200 && code < 300) {
                    return new FetchResult(true, code, response.body(), "SUCCESS", null);
                } else if (code == 403) {
                    return new FetchResult(false, code, null, "HTTP_403", "HTTP 403 Forbidden");
                } else if (code == 404) {
                    return new FetchResult(false, code, null, "HTTP_404", "HTTP 404 Not Found");
                } else if (code == 429) {
                    if (attempt < maxAttempts) {
                        Thread.sleep(1000);
                        continue;
                    }
                    return new FetchResult(false, code, null, "HTTP_429", "HTTP 429 Rate Limited");
                } else if (code >= 500) {
                    if (attempt < maxAttempts) {
                        Thread.sleep(1000);
                        continue;
                    }
                    return new FetchResult(false, code, null, "HTTP_5XX", "Server Error HTTP " + code);
                } else {
                    return new FetchResult(false, code, null, "OTHER_FAILURE", "Unexpected HTTP status " + code);
                }
            } catch (HttpConnectTimeoutException e) {
                if (attempt < maxAttempts) continue;
                return new FetchResult(false, 0, null, "CONNECT_TIMEOUT", "Connection timed out: " + e.getMessage());
            } catch (HttpTimeoutException e) {
                if (attempt < maxAttempts) continue;
                return new FetchResult(false, 0, null, "READ_TIMEOUT", "Read timed out: " + e.getMessage());
            } catch (SSLHandshakeException e) {
                return new FetchResult(false, 0, null, "TLS_CERTIFICATE_FAILURE", "TLS certificate verification failed: " + e.getMessage());
            } catch (SSLPeerUnverifiedException e) {
                return new FetchResult(false, 0, null, "TLS_HOSTNAME_FAILURE", "TLS hostname verification failed: " + e.getMessage());
            } catch (javax.net.ssl.SSLException e) {
                return new FetchResult(false, 0, null, "TLS_CERTIFICATE_FAILURE", "SSL error: " + e.getMessage());
            } catch (UnknownHostException e) {
                return new FetchResult(false, 0, null, "DNS_FAILURE", "DNS resolution failed: " + e.getMessage());
            } catch (Exception e) {
                if (attempt < maxAttempts) continue;
                return new FetchResult(false, 0, null, "OTHER_FAILURE", "Fetch failed: " + e.getMessage());
            }
        }
        return new FetchResult(false, 0, null, "OTHER_FAILURE", "Exhausted retry attempts");
    }

    /**
     * Bounded pagination: fetches up to maxPages starting from 1.
     */
    public List<FetchResult> fetchPaginated(String baseUrl, String pageParam, int maxPages) {
        List<FetchResult> results = new ArrayList<>();
        int limit = Math.min(maxPages, 5); // Safe upper bound
        Set<String> visited = new HashSet<>();

        for (int p = 1; p <= limit; p++) {
            String targetUrl = baseUrl.contains("?")
                    ? baseUrl + "&" + pageParam + "=" + p
                    : baseUrl + "?" + pageParam + "=" + p;

            if (!visited.add(targetUrl)) break;

            FetchResult r = safeFetch(targetUrl);
            results.add(r);

            // If page failed or returned empty content, stop paginating
            if (!r.success || r.body == null || r.body.length() < 200) {
                break;
            }
        }
        return results;
    }

    /**
     * Extracts scheme titles and links from HTML listing using regex patterns.
     */
    public List<Map<String, String>> extractSchemesFromHtml(String html, String baseDomain) {
        List<Map<String, String>> items = new ArrayList<>();
        if (html == null || html.isBlank()) return items;

        // Pattern 1: Link containing scholarship keywords
        Pattern linkPattern = Pattern.compile("<a\\s+[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        Matcher matcher = linkPattern.matcher(html);

        Set<String> seen = new HashSet<>();

        while (matcher.find()) {
            String href = matcher.group(1).trim();
            String text = matcher.group(2).replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();

            if (text.length() >= 10 && text.length() <= 200) {
                String lower = text.toLowerCase();
                if (lower.contains("scholarship") || lower.contains("fellowship") || lower.contains("stipend") || lower.contains("grant") || lower.contains("scheme")) {
                    String fullUrl = href.startsWith("http") ? href : (baseDomain.replaceAll("/+$", "") + "/" + href.replaceAll("^/+", ""));
                    if (seen.add(text.toLowerCase())) {
                        Map<String, String> item = new HashMap<>();
                        item.put("title", text);
                        item.put("url", fullUrl);
                        items.add(item);
                    }
                }
            }
        }
        return items;
    }
}
