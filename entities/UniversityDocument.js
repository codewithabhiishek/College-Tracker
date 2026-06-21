{
  "name": "UniversityDocument",
  "type": "object",
  "properties": {
    "university_id": {
      "type": "string",
      "description": "Reference to university"
    },
    "doc_name": {
      "type": "string",
      "description": "Document name"
    },
    "is_ready": {
      "type": "boolean",
      "description": "Whether document is ready",
      "default": false
    }
  },
  "required": [
    "university_id",
    "doc_name"
  ]
}