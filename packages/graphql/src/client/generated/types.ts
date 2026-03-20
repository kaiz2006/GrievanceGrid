export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSONObject: { input: unknown; output: unknown; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  data?: Maybe<Scalars['JSONObject']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CategoryMetric = {
  __typename?: 'CategoryMetric';
  category: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  resolved: Scalars['Int']['output'];
};

export type ContestationResult = {
  __typename?: 'ContestationResult';
  auditId: Scalars['String']['output'];
  auditTaskId: Scalars['String']['output'];
  auditTriggered: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type DashboardData = {
  __typename?: 'DashboardData';
  byCategory: Array<CategoryMetric>;
  byPriority: Array<PriorityMetric>;
  heatMapData: Array<HeatMapPoint>;
  predictiveAlerts: Array<Scalars['JSONObject']['output']>;
  slaCompliance: SlaCompliance;
  summary: DashboardSummary;
};

export type DashboardSummary = {
  __typename?: 'DashboardSummary';
  avgResolutionHours?: Maybe<Scalars['Float']['output']>;
  escalated: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  resolved: Scalars['Int']['output'];
  totalGrievances: Scalars['Int']['output'];
};

export type FeedbackResult = {
  __typename?: 'FeedbackResult';
  grievanceId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  submittedAt: Scalars['String']['output'];
};

export type GeoCluster = {
  __typename?: 'GeoCluster';
  centroidLat: Scalars['Float']['output'];
  centroidLng: Scalars['Float']['output'];
  clusterId: Scalars['ID']['output'];
  clusterType: Scalars['String']['output'];
  crisisScore?: Maybe<Scalars['Float']['output']>;
  isActive: Scalars['Boolean']['output'];
  memberCount: Scalars['Int']['output'];
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  topics?: Maybe<Array<Scalars['String']['output']>>;
};

export type Grievance = {
  __typename?: 'Grievance';
  afterPhotoUrl?: Maybe<Scalars['String']['output']>;
  aiCategory?: Maybe<Scalars['String']['output']>;
  aiPriority?: Maybe<Scalars['String']['output']>;
  aiSummary?: Maybe<Scalars['String']['output']>;
  assignedDepartmentId?: Maybe<Scalars['String']['output']>;
  assignedDepartmentName?: Maybe<Scalars['String']['output']>;
  assignedTeamId?: Maybe<Scalars['String']['output']>;
  assignedTeamName?: Maybe<Scalars['String']['output']>;
  beforePhotoUrl?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  citizenId?: Maybe<Scalars['String']['output']>;
  citizenName?: Maybe<Scalars['String']['output']>;
  citizenPhone?: Maybe<Scalars['String']['output']>;
  damageSeverity?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  gridId: Scalars['String']['output'];
  grievanceId: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  locationAddress?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  priority: Scalars['String']['output'];
  status: Scalars['String']['output'];
  submittedAt?: Maybe<Scalars['String']['output']>;
  timeline: Array<TimelineEvent>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export enum GrievanceCategory {
  BuildingViolation = 'BUILDING_VIOLATION',
  Electricity = 'ELECTRICITY',
  Environment = 'ENVIRONMENT',
  Infrastructure = 'INFRASTRUCTURE',
  Other = 'OTHER',
  PublicTransport = 'PUBLIC_TRANSPORT',
  Roads = 'ROADS',
  Sanitation = 'SANITATION',
  WaterSupply = 'WATER_SUPPLY'
}

export type GrievanceConnection = {
  __typename?: 'GrievanceConnection';
  count: Scalars['Int']['output'];
  items: Array<Grievance>;
};

export type GrievanceFilter = {
  category?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type GrievanceInput = {
  beforePhotoUrl?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  hintCategory?: InputMaybe<Scalars['String']['input']>;
  hintDepartment?: InputMaybe<Scalars['String']['input']>;
  hintPriority?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  locationAddress?: InputMaybe<Scalars['String']['input']>;
  locationText?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export enum GrievanceStatus {
  Assigned = 'ASSIGNED',
  Closed = 'CLOSED',
  Contested = 'CONTESTED',
  Created = 'CREATED',
  Escalated = 'ESCALATED',
  InProgress = 'IN_PROGRESS',
  PendingAssignment = 'PENDING_ASSIGNMENT',
  PendingClassification = 'PENDING_CLASSIFICATION',
  PendingVerification = 'PENDING_VERIFICATION',
  Resolved = 'RESOLVED',
  Verified = 'VERIFIED'
}

export type GrievanceSubmission = {
  __typename?: 'GrievanceSubmission';
  gridId: Scalars['String']['output'];
  grievanceId: Scalars['ID']['output'];
  processingTaskId: Scalars['String']['output'];
  resolutionDeadline: Scalars['String']['output'];
  responseDeadline: Scalars['String']['output'];
  status: Scalars['String']['output'];
  submittedAt: Scalars['String']['output'];
};

export type HeatMapPoint = {
  __typename?: 'HeatMapPoint';
  intensity: Scalars['Float']['output'];
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: AuthResponse;
  contestResolution: ContestationResult;
  googleAuth: TokenResponse;
  login: TokenResponse;
  logout: AuthResponse;
  refreshToken: TokenResponse;
  register: TokenResponse;
  submitFeedback: FeedbackResult;
  submitGrievance: GrievanceSubmission;
  updateStatus: Grievance;
};


export type MutationChangePasswordArgs = {
  confirmPassword: Scalars['String']['input'];
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationContestResolutionArgs = {
  evidencePhoto?: InputMaybe<Scalars['String']['input']>;
  grievanceId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationGoogleAuthArgs = {
  idToken: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSubmitFeedbackArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  grievanceId: Scalars['ID']['input'];
  isSatisfied?: InputMaybe<Scalars['Boolean']['input']>;
  rating: Scalars['Int']['input'];
};


export type MutationSubmitGrievanceArgs = {
  input: GrievanceInput;
};


export type MutationUpdateStatusArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status: GrievanceStatus;
};

export enum Priority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type PriorityMetric = {
  __typename?: 'PriorityMetric';
  avgResolutionHours?: Maybe<Scalars['Float']['output']>;
  count: Scalars['Int']['output'];
  priority: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  clusters: Array<GeoCluster>;
  dashboard: DashboardData;
  grievance?: Maybe<Grievance>;
  grievances: GrievanceConnection;
  me?: Maybe<User>;
  track: TrackingInfo;
};


export type QueryClustersArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  clusterType?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDashboardArgs = {
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGrievanceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGrievancesArgs = {
  filter?: InputMaybe<GrievanceFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTrackArgs = {
  gridId: Scalars['String']['input'];
};

export type SlaCompliance = {
  __typename?: 'SLACompliance';
  resolutionSlaMet?: Maybe<Scalars['Float']['output']>;
  responseSlaMet?: Maybe<Scalars['Float']['output']>;
};

export type TeamLocation = {
  __typename?: 'TeamLocation';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type TimelineEvent = {
  __typename?: 'TimelineEvent';
  description: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  status: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

export type TokenResponse = {
  __typename?: 'TokenResponse';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Int']['output'];
  refreshToken: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
  user: User;
};

export type TrackingInfo = {
  __typename?: 'TrackingInfo';
  assignedTeamLocation?: Maybe<TeamLocation>;
  currentSlaType?: Maybe<Scalars['String']['output']>;
  currentStatus: Scalars['String']['output'];
  gridId: Scalars['String']['output'];
  predictedEtaMinutes?: Maybe<Scalars['Int']['output']>;
  slaDeadlines: Scalars['JSONObject']['output'];
  slaRemainingSeconds?: Maybe<Scalars['Int']['output']>;
  timeline: Array<TimelineEvent>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  departmentId?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
};
