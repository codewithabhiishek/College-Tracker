{
  "name": "GlobalDocument",
  "type": "object",
  "properties": {
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
    "doc_name"
  ]
}