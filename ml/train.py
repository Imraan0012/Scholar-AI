"""
Scholar AI — Real Decision Tree Model Trainer
Trains scikit-learn DecisionTreeClassifier, computes verified performance metrics,
and serializes model and schema metadata for real-time inference.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timezone
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from dataset import generate_scholarship_dataset, FEATURE_COLUMNS

def train_decision_tree_model():
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(ml_dir, 'dataset.csv')

    if not os.path.exists(dataset_path):
        print("[Trainer] Generating verified training dataset...")
        df = generate_scholarship_dataset(num_samples=7500, random_seed=42)
        df.to_csv(dataset_path, index=False)
    else:
        df = pd.read_csv(dataset_path)

    X = df[FEATURE_COLUMNS]
    y = df['is_eligible']

    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Initialize and train Decision Tree Classifier
    dt_model = DecisionTreeClassifier(
        criterion='gini',
        max_depth=9,
        min_samples_split=10,
        min_samples_leaf=4,
        random_state=42
    )

    dt_model.fit(X_train, y_train)

    # Predictions & Evaluation
    y_pred = dt_model.predict(X_test)
    y_pred_proba = dt_model.predict_proba(X_test)

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Feature Importance
    feature_importances = {
        col: round(float(imp), 4)
        for col, imp in zip(FEATURE_COLUMNS, dt_model.feature_importances_)
    }
    # Sort by importance descending
    sorted_importances = dict(sorted(feature_importances.items(), key=lambda item: item[1], reverse=True))

    model_metadata = {
        'modelVersion': 'v2.4.0-dt-native',
        'algorithm': 'DecisionTreeClassifier',
        'trainingTimestamp': datetime.now(timezone.utc).isoformat(),
        'dataset': {
            'totalSamples': int(len(df)),
            'trainSamples': int(len(X_train)),
            'testSamples': int(len(X_test)),
            'featureCount': len(FEATURE_COLUMNS),
            'featureColumns': FEATURE_COLUMNS
        },
        'hyperparameters': {
            'criterion': 'gini',
            'maxDepth': 9,
            'minSamplesSplit': 10,
            'minSamplesLeaf': 4
        },
        'metrics': {
            'accuracy': round(acc, 4),
            'precision': round(prec, 4),
            'recall': round(rec, 4),
            'f1Score': round(f1, 4),
            'confusionMatrix': cm
        },
        'featureImportances': sorted_importances
    }

    # Save artifacts
    joblib.dump(dt_model, os.path.join(ml_dir, 'model.joblib'))
    with open(os.path.join(ml_dir, 'metadata.json'), 'w') as f:
        json.dump(model_metadata, f, indent=2)

    print("=============================================================================")
    print("SCHOLAR AI — DECISION TREE MODEL TRAINING REPORT")
    print("=============================================================================")
    print(f"Model Version: {model_metadata['modelVersion']}")
    print(f"Accuracy:      {acc * 100:.2f}%")
    print(f"Precision:     {prec * 100:.2f}%")
    print(f"Recall:        {rec * 100:.2f}%")
    print(f"F1-Score:      {f1:.4f}")
    print(f"Confusion Matrix: {cm}")
    print("Top Features:", list(sorted_importances.items())[:6])
    print("Model serialized to ml/model.joblib and ml/metadata.json")
    print("=============================================================================")

    return dt_model, model_metadata

if __name__ == '__main__':
    train_decision_tree_model()
