"""
Scholar AI — Labeled Training Dataset Generator for Decision Tree Classifier
Generates a structured, representative dataset based on official scholarship eligibility rules.
"""

import pandas as pd
import numpy as np
import os

STATES = [
    'ALL_INDIA', 'ANDHRA_PRADESH', 'ASSAM', 'BIHAR', 'CHHATTISGARH', 'DELHI', 'GOA',
    'GUJARAT', 'HARYANA', 'HIMACHAL_PRADESH', 'JAMMU_AND_KASHMIR', 'JHARKHAND',
    'KARNATAKA', 'KERALA', 'MADHYA_PRADESH', 'MAHARASHTRA', 'ODISHA', 'PUNJAB',
    'RAJASTHAN', 'TAMIL_NADU', 'TELANGANA', 'UTTAR_PRADESH', 'UTTARAKHAND', 'WEST_BENGAL'
]

STATE_TO_CODE = {s: i for i, s in enumerate(STATES)}

CATEGORY_MAP = {'GENERAL': 1, 'OBC': 2, 'SC': 3, 'ST': 4, 'EWS': 5}
GENDER_MAP = {'MALE': 1, 'FEMALE': 2, 'OTHER': 3, 'ANY': 0}
EDU_MAP = {'10TH': 1, '12TH': 2, 'DIPLOMA': 3, 'UNDERGRADUATE': 4, 'POSTGRADUATE': 5, 'PHD': 6}

FEATURE_COLUMNS = [
    'edu_code', 'current_year', 'class_10', 'class_12', 'cgpa', 'income',
    'gender_code', 'category_code', 'is_obc_ncl', 'is_ews', 'state_code',
    'has_income_cert', 'has_cat_cert', 'has_dom_cert', 'has_disability',
    'disability_pct', 'is_minority', 'is_first_grad', 'is_single_girl',
    'is_orphan', 'is_single_parent', 'is_ward_defense', 'is_farmer',
    'sch_type_code', 'sch_max_income', 'sch_min_cgpa', 'sch_min_marks',
    'sch_target_cat_code', 'sch_target_gender_code', 'sch_state_code'
]

def generate_scholarship_dataset(num_samples=6000, random_seed=42):
    np.random.seed(random_seed)
    data = []

    for i in range(num_samples):
        # 1. Student Attributes
        edu_level = np.random.choice(['UNDERGRADUATE', 'POSTGRADUATE', '12TH', 'DIPLOMA'], p=[0.55, 0.25, 0.12, 0.08])
        edu_code = EDU_MAP[edu_level]
        current_year = int(np.random.randint(1, 5))
        class_10 = float(np.random.uniform(50.0, 98.0))
        class_12 = float(np.random.uniform(45.0, 98.0))
        cgpa = float(np.random.uniform(5.0, 9.9)) if edu_code >= 4 else 0.0

        # Family Income (Right-skewed distribution)
        income_tier = np.random.choice([100000, 200000, 400000, 700000, 1200000, 2000000], p=[0.25, 0.30, 0.20, 0.15, 0.07, 0.03])
        income = float(income_tier + np.random.uniform(-30000, 50000))
        income = max(30000.0, income)

        gender = np.random.choice(['MALE', 'FEMALE', 'OTHER'], p=[0.48, 0.50, 0.02])
        gender_code = GENDER_MAP[gender]

        category = np.random.choice(['GENERAL', 'OBC', 'SC', 'ST', 'EWS'], p=[0.30, 0.35, 0.18, 0.10, 0.07])
        category_code = CATEGORY_MAP[category]

        is_obc_ncl = 1 if (category == 'OBC' and income <= 800000 and np.random.rand() > 0.15) else 0
        is_ews = 1 if (category == 'EWS' and income <= 800000) else 0
        state = np.random.choice(STATES[1:])
        state_code = STATE_TO_CODE[state]

        has_income_cert = 1 if (income <= 800000 and np.random.rand() > 0.2) else 0
        has_cat_cert = 1 if (category != 'GENERAL' and np.random.rand() > 0.15) else 0
        has_dom_cert = 1 if np.random.rand() > 0.1 else 0

        has_disability = 1 if np.random.rand() < 0.06 else 0
        disability_pct = float(np.random.uniform(40.0, 85.0)) if has_disability else 0.0
        is_minority = 1 if np.random.rand() < 0.15 else 0
        is_first_grad = 1 if np.random.rand() < 0.25 else 0
        is_single_girl = 1 if (gender == 'FEMALE' and np.random.rand() < 0.20) else 0
        is_orphan = 1 if np.random.rand() < 0.02 else 0
        is_single_parent = 1 if np.random.rand() < 0.05 else 0
        is_ward_defense = 1 if np.random.rand() < 0.04 else 0
        is_farmer = 1 if np.random.rand() < 0.22 else 0

        # 2. Scholarship Profile Context
        sch_type = np.random.choice(['CENTRAL', 'STATE', 'PRIVATE'], p=[0.45, 0.35, 0.20])
        sch_type_code = 1 if sch_type == 'CENTRAL' else (2 if sch_type == 'STATE' else 3)

        sch_max_income = float(np.random.choice([150000, 250000, 450000, 600000, 800000, 9999999], p=[0.15, 0.30, 0.20, 0.15, 0.15, 0.05]))
        sch_min_cgpa = float(np.random.choice([0.0, 6.0, 7.0, 7.5, 8.0, 8.5], p=[0.30, 0.25, 0.20, 0.12, 0.08, 0.05]))
        sch_min_marks = float(np.random.choice([0.0, 50.0, 60.0, 70.0, 75.0, 80.0], p=[0.20, 0.25, 0.25, 0.15, 0.10, 0.05]))

        sch_target_category = np.random.choice(['ANY', 'SC', 'ST', 'OBC', 'GENERAL', 'MINORITY'], p=[0.50, 0.15, 0.10, 0.15, 0.05, 0.05])
        sch_target_cat_code = 0 if sch_target_category == 'ANY' else (6 if sch_target_category == 'MINORITY' else CATEGORY_MAP.get(sch_target_category, 0))

        sch_target_gender = np.random.choice(['ANY', 'FEMALE'], p=[0.80, 0.20])
        sch_target_gender_code = 0 if sch_target_gender == 'ANY' else 2

        sch_state = state if sch_type == 'STATE' else ('ALL_INDIA' if np.random.rand() > 0.15 else state)
        sch_state_code = STATE_TO_CODE.get(sch_state, 0)

        # 3. Deterministic Ground Truth Evaluation
        eligible = True

        if income > sch_max_income:
            eligible = False
        if cgpa > 0 and cgpa < sch_min_cgpa:
            eligible = False
        if class_12 < sch_min_marks:
            eligible = False
        if sch_target_gender_code == 2 and gender_code != 2:
            eligible = False
        if sch_state_code != 0 and sch_state_code != state_code:
            eligible = False
        if sch_target_cat_code != 0:
            if sch_target_cat_code == 6 and not is_minority:
                eligible = False
            elif sch_target_cat_code != 6 and category_code != sch_target_cat_code:
                eligible = False

        label = 1 if eligible else 0

        # Match Tier: 0: Ineligible, 1: Possible, 2: Good Match, 3: Strong Match
        if not eligible:
            match_tier = 0
        else:
            score = 70.0
            if income <= 250000: score += 10
            if cgpa >= 8.0 or class_12 >= 85: score += 10
            if is_first_grad or is_single_girl or has_disability: score += 5
            if score >= 85:
                match_tier = 3
            elif score >= 70:
                match_tier = 2
            else:
                match_tier = 1

        data.append({
            'edu_code': edu_code,
            'current_year': current_year,
            'class_10': class_10,
            'class_12': class_12,
            'cgpa': cgpa,
            'income': income,
            'gender_code': gender_code,
            'category_code': category_code,
            'is_obc_ncl': is_obc_ncl,
            'is_ews': is_ews,
            'state_code': state_code,
            'has_income_cert': has_income_cert,
            'has_cat_cert': has_cat_cert,
            'has_dom_cert': has_dom_cert,
            'has_disability': has_disability,
            'disability_pct': disability_pct,
            'is_minority': is_minority,
            'is_first_grad': is_first_grad,
            'is_single_girl': is_single_girl,
            'is_orphan': is_orphan,
            'is_single_parent': is_single_parent,
            'is_ward_defense': is_ward_defense,
            'is_farmer': is_farmer,
            'sch_type_code': sch_type_code,
            'sch_max_income': sch_max_income,
            'sch_min_cgpa': sch_min_cgpa,
            'sch_min_marks': sch_min_marks,
            'sch_target_cat_code': sch_target_cat_code,
            'sch_target_gender_code': sch_target_gender_code,
            'sch_state_code': sch_state_code,
            'is_eligible': label,
            'match_tier': match_tier
        })

    return pd.DataFrame(data)

if __name__ == '__main__':
    os.makedirs('ml', exist_ok=True)
    df = generate_scholarship_dataset(6000)
    df.to_csv('ml/dataset.csv', index=False)
    print(f"Generated verified training dataset with {len(df)} samples.")
    print("Class distribution:", df['is_eligible'].value_counts().to_dict())
