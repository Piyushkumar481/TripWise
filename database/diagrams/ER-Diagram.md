Users
-----
id (PK)
full_name
email
password
phone
profile_image_url
email_verified
created_at
updated_at
        │
        │ 1
        │
        ▼
Trips
-----
id (PK)
user_id (FK)
title
destination_country
destination_city
start_date
end_date
budget
status
created_at
        │
        ├──────────────┬──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
Expenses      Documents       Notes      ChecklistItems