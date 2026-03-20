import numpy as np

class GrievanceEnv:
    def __init__(self, departments):
        self.departments = departments
        self.num_departments = len(departments)
        self.state_size = 10  # Assuming 10 features for grievance state
        self.action_size = self.num_departments

    def reset(self):
        # Return initial random grievance state
        return np.random.rand(self.state_size).astype(np.float32)

    def get_reward(self, action, grievance_data):
        """
        Define reward function:
        - +50 if resolved within SLA
        - +30 if citizen satisfaction >= 4
        - -40 if escalated
        - -60 if contested
        """
        # In a real scenario, this would come from a simulator or historical data
        # For simplicity, we return a mock reward
        reward = 0
        if grievance_data.get('resolved_within_sla'):
            reward += 50
        if grievance_data.get('satisfaction_score', 0) >= 4:
            reward += 30
        if grievance_data.get('is_escalated'):
            reward -= 40
        if grievance_data.get('is_contested'):
            reward -= 60
        return reward

    def step(self, action, next_grievance_data):
        # In this context, the "next state" is just the next grievance to route
        next_state = np.random.rand(self.state_size).astype(np.float32)
        done = False # Continuous stream of grievances
        return next_state, done
