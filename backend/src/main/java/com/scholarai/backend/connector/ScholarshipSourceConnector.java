package com.scholarai.backend.connector;

import java.util.List;
import java.util.Map;

public interface ScholarshipSourceConnector {
    String getSourceId();
    String getSourceName();
    String getCategory();
    String getState();
    String getPortalUrl();
    List<Map<String, Object>> discoverSchemes();
}
