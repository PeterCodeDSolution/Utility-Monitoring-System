-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    contact_person VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Sites Table
CREATE TABLE IF NOT EXISTS sites (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    zone_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'good',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Utility Readings Table
CREATE TABLE IF NOT EXISTS utility_readings (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id),
    reading_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    water_usage DECIMAL(10, 2),
    pac_usage DECIMAL(10, 2),
    polymer_usage DECIMAL(10, 2),
    chlorine_usage DECIMAL(10, 2),
    notes TEXT,
    recorded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Zones Table
CREATE TABLE IF NOT EXISTS zones (
    id SERIAL PRIMARY KEY,
    zone_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    shape_type VARCHAR(20) NOT NULL,
    coordinates JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'good',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id),
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Insert Demo Data: Users
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$qJIAlzjH6VxnVOm.f5Veru5aTGGGMEZh39m1h7jUlxK3MS9MSywPW', 'admin'), -- password: admin
('operator', '$2a$10$qJIAlzjH6VxnVOm.f5Veru5aTGGGMEZh39m1h7jUlxK3MS9MSywPW', 'operator'); -- password: operator

-- Insert Demo Data: Clients
INSERT INTO clients (name, address, contact_person, contact_email, contact_phone, status) VALUES
('Thai Eastern Industrial Park', '88 Moo 5, Pluakdaeng, Rayong 21140', 'Somchai Jaidee', 'somchai@example.com', '0812345678', 'active'),
('Map Ta Phut Industrial Estate', '9 I-7 Road, Map Ta Phut, Muang, Rayong 21150', 'Wichai Sangtong', 'wichai@example.com', '0823456789', 'active'),
('Amata City Chonburi', '700/2 Moo 1, Klong Tamru, Muang, Chonburi 20000', 'Malee Rakdee', 'malee@example.com', '0834567890', 'active');

-- Insert Demo Data: Sites
INSERT INTO sites (client_id, name, location, zone_id, status) VALUES
(1, 'Factory A1', 'Zone A, Plot 1', 'A1', 'good'),
(1, 'Factory A2', 'Zone A, Plot 2', 'A2', 'warning'),
(1, 'Factory B1', 'Zone B, Plot 1', 'B1', 'good'),
(1, 'Factory B2', 'Zone B, Plot 2', 'B2', 'danger'),
(2, 'Chemical Plant 1', 'Zone C, Plot 1', 'C1', 'good'),
(2, 'Chemical Plant 2', 'Zone C, Plot 2', 'C2', 'good'),
(3, 'Assembly Line 1', 'Zone D, Plot 1', 'D1', 'warning'),
(3, 'Assembly Line 2', 'Zone D, Plot 2', 'D2', 'good');

-- Insert Demo Data: Zones with GeoJSON-like coordinates
INSERT INTO zones (zone_id, name, shape_type, coordinates, status) VALUES
('A1', 'Factory A1', 'polygon', '[{"x":100, "y":100}, {"x":150, "y":100}, {"x":150, "y":150}, {"x":100, "y":150}]', 'good'),
('A2', 'Factory A2', 'polygon', '[{"x":160, "y":100}, {"x":210, "y":100}, {"x":210, "y":150}, {"x":160, "y":150}]', 'warning'),
('B1', 'Factory B1', 'polygon', '[{"x":100, "y":160}, {"x":150, "y":160}, {"x":150, "y":210}, {"x":100, "y":210}]', 'good'),
('B2', 'Factory B2', 'polygon', '[{"x":160, "y":160}, {"x":210, "y":160}, {"x":210, "y":210}, {"x":160, "y":210}]', 'danger'),
('C1', 'Chemical Plant 1', 'polygon', '[{"x":220, "y":100}, {"x":270, "y":100}, {"x":270, "y":150}, {"x":220, "y":150}]', 'good'),
('C2', 'Chemical Plant 2', 'polygon', '[{"x":280, "y":100}, {"x":330, "y":100}, {"x":330, "y":150}, {"x":280, "y":150}]', 'good'),
('D1', 'Assembly Line 1', 'polygon', '[{"x":220, "y":160}, {"x":270, "y":160}, {"x":270, "y":210}, {"x":220, "y":210}]', 'warning'),
('D2', 'Assembly Line 2', 'polygon', '[{"x":280, "y":160}, {"x":330, "y":160}, {"x":330, "y":210}, {"x":280, "y":210}]', 'good');

-- Insert Demo Data: Utility Readings
INSERT INTO utility_readings (site_id, reading_date, water_usage, pac_usage, polymer_usage, chlorine_usage, notes, recorded_by) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '30 days', 120.50, 15.2, 5.3, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '29 days', 125.30, 16.1, 5.5, 2.2, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '28 days', 118.70, 15.0, 5.1, 2.0, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '27 days', 122.40, 15.5, 5.4, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '26 days', 126.80, 16.2, 5.6, 2.3, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '25 days', 130.20, 16.8, 5.8, 2.4, 'Increased water usage due to cleaning', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '24 days', 128.10, 16.5, 5.7, 2.3, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '23 days', 124.50, 16.0, 5.5, 2.2, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '22 days', 121.30, 15.6, 5.4, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '21 days', 119.80, 15.4, 5.3, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '20 days', 118.20, 15.2, 5.2, 2.0, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '19 days', 121.50, 15.6, 5.4, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '18 days', 125.70, 16.1, 5.6, 2.2, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '17 days', 129.90, 16.7, 5.8, 2.3, 'Higher than normal usage', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '16 days', 132.40, 17.0, 5.9, 2.4, 'Higher than normal usage', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '15 days', 128.60, 16.5, 5.7, 2.3, 'Returning to normal', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '14 days', 124.80, 16.0, 5.5, 2.2, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '13 days', 122.30, 15.7, 5.4, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '12 days', 120.10, 15.4, 5.3, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '11 days', 118.40, 15.2, 5.2, 2.0, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '10 days', 119.70, 15.4, 5.3, 2.1, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '9 days', 122.90, 15.8, 5.5, 2.2, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '8 days', 126.50, 16.2, 5.6, 2.3, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '7 days', 130.10, 16.7, 5.8, 2.3, 'Increased usage due to new production run', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '6 days', 134.30, 17.2, 6.0, 2.4, 'Higher than normal usage', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '5 days', 132.80, 17.0, 5.9, 2.4, 'Higher than normal usage', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '4 days', 129.40, 16.6, 5.8, 2.3, 'Returning to normal', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '3 days', 126.70, 16.3, 5.6, 2.2, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '2 days', 123.50, 15.9, 5.5, 2.2, 'Normal operation', 1),
(1, CURRENT_TIMESTAMP - INTERVAL '1 day', 120.80, 15.5, 5.4, 2.1, 'Normal operation', 1);

-- Insert Demo Data: Alerts
INSERT INTO alerts (site_id, alert_type, message, status, created_at, resolved_at) VALUES
(2, 'High Water Usage', 'Water usage exceeds expected levels by 15%', 'active', CURRENT_TIMESTAMP - INTERVAL '3 days', NULL),
(4, 'Chemical Imbalance', 'PAC levels critical', 'active', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL),
(7, 'Low Chlorine', 'Chlorine levels below minimum threshold', 'resolved', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days');

-- Create function to calculate rolling averages
CREATE OR REPLACE FUNCTION get_utility_summary(days INTEGER)
RETURNS TABLE (
    date_day DATE,
    avg_water DECIMAL(10, 2),
    avg_pac DECIMAL(10, 2),
    avg_polymer DECIMAL(10, 2),
    avg_chlorine DECIMAL(10, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE(reading_date) AS date_day,
        AVG(water_usage) AS avg_water,
        AVG(pac_usage) AS avg_pac,
        AVG(polymer_usage) AS avg_polymer,
        AVG(chlorine_usage) AS avg_chlorine
    FROM utility_readings
    WHERE reading_date >= CURRENT_TIMESTAMP - (days || ' days')::INTERVAL
    GROUP BY DATE(reading_date)
    ORDER BY date_day;
END;
$$ LANGUAGE plpgsql; 