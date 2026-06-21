{
  "name": "University",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "University name"
    },
    "country": {
      "type": "string",
      "description": "Country"
    },
    "program": {
      "type": "string",
      "description": "Program name"
    },
    "deadline": {
      "type": "string",
      "format": "date",
      "description": "Application deadline"
    },
    "status": {
      "type": "string",
      "enum": [
        "researching",
        "preparing",
        "submitted",
        "interview",
        "accepted",
        "rejected",
        "waitlisted"
      ],
      "default": "researching",
      "description": "Application status"
    },
    "portal_url": {
      "type": "string",
      "description": "Application portal URL"
    },
    "application_fee": {
      "type": "number",
      "description": "Application fee amount"
    },
    "fee_paid": {
      "type": "boolean",
      "description": "Whether fee has been paid"
    },
    "notes": {
      "type": "string",
      "description": "Notes about the application"
    }
  },
  "required": [
    "name",
    "country",
    "status"
  ]
}