import os
import torch
from agent import RoutingRLAgent
from environment import GrievanceEnv

def train_rl_agent(epochs=100, batch_size=32):
    departments = ["PWD", "ELECTRICITY", "TRANSPORT", "WATER", "SANITATION", "HEALTH", "POLICE", "FIRE", "DISASTER", "ENVIRONMENT"]
    env = GrievanceEnv(departments)
    agent = RoutingRLAgent(state_size=env.state_size, action_size=env.action_size)
    
    for e in range(epochs):
        state = env.reset()
        for time in range(500):
            action = agent.get_action(state)
            
            # Mock next grievance data for reward calculation
            # In production, this would be historical resolution data
            mock_next_data = {
                'resolved_within_sla': True if random.random() > 0.3 else False,
                'satisfaction_score': random.randint(1, 5),
                'is_escalated': True if random.random() > 0.9 else False,
                'is_contested': True if random.random() > 0.95 else False
            }
            
            reward = env.get_reward(action, mock_next_data)
            next_state, done = env.step(action, mock_next_data)
            
            agent.remember(state, action, reward, next_state, done)
            state = next_state
            
            if len(agent.memory) > batch_size:
                agent.replay(batch_size)
        
        agent.update_target_model()
        if e % 10 == 0:
            print(f"Episode: {e}/{epochs}, Epsilon: {agent.epsilon:.2f}")

    os.makedirs("ai-models/rl_agent/models", exist_ok=True)
    agent.save("ai-models/rl_agent/models/routing_rl_model.pth")
    print("RL Agent trained and saved.")

import random
if __name__ == "__main__":
    train_rl_agent()
