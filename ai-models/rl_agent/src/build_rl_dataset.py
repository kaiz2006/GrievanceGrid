import pandas as pd
import numpy as np
from datetime import datetime

def build_rl_dataset(input_csv: str, output_csv: str):
    print(f"Reading 311 data from {input_csv}...")
    # Read only necessary columns to save memory
    cols = ['Created Date', 'Closed Date', 'Agency', 'Problem (formerly Complaint Type)']
    df = pd.read_csv(input_csv, usecols=cols).dropna()
    
    print("Calculating resolution metrics...")
    df['Created Date'] = pd.to_datetime(df['Created Date'])
    df['Closed Date'] = pd.to_datetime(df['Closed Date'])
    
    # Calculate resolution hours
    df['resolution_hours'] = (df['Closed Date'] - df['Created Date']).dt.total_seconds() / 3600
    
    # Simulate SLA (e.g., avg SLA is 48 hours for most urban issues)
    SLA_HOURS = 48
    df['resolved_within_sla'] = df['resolution_hours'] <= SLA_HOURS
    
    # Synthesize satisfaction score based on SLA and luck
    # If within SLA, score is 3-5. If not, score is 1-3.
    df['satisfaction_score'] = df['resolved_within_sla'].apply(
        lambda x: np.random.randint(3, 6) if x else np.random.randint(1, 4)
    )
    
    # Priority mapping (Guessing based on keywords)
    def guess_priority(complaint):
        urgent = ['DANGEROUS', 'EMERGENCY', 'FIRE', 'GAS LEAK', 'WATER MAIN']
        if any(word in str(complaint).upper() for word in urgent):
            return "CRITICAL"
        return "MODERATE"

    df['priority'] = df['Problem (formerly Complaint Type)'].apply(guess_priority)
    
    # Rename for RL trainer
    df = df.rename(columns={'Agency': 'department'})
    
    # Select final columns
    final_cols = ['priority', 'department', 'resolved_within_sla', 
                  'satisfaction_score', 'resolution_hours']
    
    print(f"Saving RL dataset to {output_csv}...")
    df[final_cols].to_csv(output_csv, index=False)
    print("Done!")

if __name__ == "__main__":
    input_file = "ai-models/gnn/data/311_Service_Requests_from_2020_to_Present_20260321 (2).csv"
    output_file = "ai-models/rl_agent/data/historical_grievances.csv"
    build_rl_dataset(input_file, output_file)
