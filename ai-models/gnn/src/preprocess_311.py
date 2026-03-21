import os
import pandas as pd
import torch
from sklearn.feature_extraction.text import TfidfVectorizer
from data_loader import graph_manager

# Mapping NYC Agencies to our project's Departments
# We only map agencies that have a corresponding node in our GRAPH_DATA
AGENCY_MAP = {
    "NYPD": "POLICE",
    "DEP": "WATER",
    "DSNY": "SANITATION",
    "DOT": "TRANSPORT",
    "DPR": "ENVIRONMENT",
    "DOHMH": "HEALTH",
    "FDNY": "FIRE",
    "TLC": "TRANSPORT",
    # "DHS": "SOCIAL",      # Excluded: Not in DEFAULT_GRAPH
    # "DCWP": "ECONOMY",    # Excluded: Not in DEFAULT_GRAPH
}

def preprocess_311(csv_path: str, output_path: str):
    print(f"Loading 311 data from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Filter for agencies we have mapped AND that exist in our graph
    valid_agencies = [k for k, v in AGENCY_MAP.items() if v in graph_manager.dept_to_id]
    df = df[df['Agency'].isin(valid_agencies)].copy()
    
    if len(df) == 0:
        print("Error: No rows left after filtering for valid agencies!")
        return

    print(f"Found {len(df)} valid records. Vectorizing Complaint Types...")
    vectorizer = TfidfVectorizer(max_features=10) # Matches num_features in trainer.py
    tfidf_matrix = vectorizer.fit_transform(df['Problem (formerly Complaint Type)'].fillna(''))
    features = torch.tensor(tfidf_matrix.toarray(), dtype=torch.float)
    
    print("Mapping targets...")
    # Map Agency -> Dept -> ID. Since we filtered above, this is safe.
    df['dept_name'] = df['Agency'].map(AGENCY_MAP)
    targets = df['dept_name'].map(graph_manager.dept_to_id)
    
    target_ids = torch.tensor(targets.values, dtype=torch.long)
    
    # Save as a PyTorch PT file for the trainer to load
    processed_data = {
        "features": features,
        "targets": target_ids,
        "agencies": df['Agency'].tolist(),
        "complaint_types": df['Problem (formerly Complaint Type)'].tolist()
    }
    
    torch.save(processed_data, output_path)
    print(f"Preprocessed data saved to {output_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(current_dir, "..", "data", "311_Service_Requests_from_2020_to_Present_20260321 (2).csv")
    output_file = os.path.join(current_dir, "..", "data", "preprocessed_311.pt")
    
    if not os.path.exists(input_file):
        # Fallback for local vs root run
        input_file = "ai-models/gnn/data/311_Service_Requests_from_2020_to_Present_20260321 (2).csv"
        output_file = "ai-models/gnn/data/preprocessed_311.pt"

    import os
    preprocess_311(input_file, output_file)
