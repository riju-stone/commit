use chrono::Utc;

// Helper function to get current timestamp
pub fn now() -> i64 {
    Utc::now().timestamp_millis()
}
