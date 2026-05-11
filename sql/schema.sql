CREATE TABLE IF NOT EXISTS dashboard_usage_logs (
    id BIGSERIAL PRIMARY KEY,
    mobile_number VARCHAR(20) NOT NULL,
    session_id UUID,
    first_seen_at TIMESTAMP DEFAULT NOW(),
    last_seen_at TIMESTAMP DEFAULT NOW(),
    total_visits INTEGER DEFAULT 1,
    viewed_today_metrics BOOLEAN DEFAULT FALSE,
    viewed_overall_metrics BOOLEAN DEFAULT FALSE,
    viewed_history_table BOOLEAN DEFAULT FALSE,
    device_type VARCHAR(20),
    browser VARCHAR(100),
    ip_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expert_metrics_snapshot (
    id BIGSERIAL PRIMARY KEY,
    mobile_number VARCHAR(20) NOT NULL,
    metric_date DATE NOT NULL,
    availability_hours NUMERIC(5,2),
    talktime_hours NUMERIC(5,2),
    missed_calls INTEGER,
    total_calls INTEGER,
    active_day BOOLEAN,
    above_five_hours BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_logs_mobile ON dashboard_usage_logs(mobile_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_metrics_mobile_date ON expert_metrics_snapshot(mobile_number, metric_date);
CREATE INDEX IF NOT EXISTS idx_dashboard_mobile ON dashboard_usage_logs(mobile_number);
CREATE INDEX IF NOT EXISTS idx_metrics_mobile ON expert_metrics_snapshot(mobile_number);
