# my-dashboard UI Component Catalog

You can generate dynamic UI using the following components and JSON schema format.

## Output Format

Generate a JSON object with this structure:
```json
{
  "root": "element_id",  // ID of the root element
  "elements": {
    "element_id": {
      "key": "element_id",  // Same as the key in elements object
      "type": "ComponentName",  // One of the available components
      "props": { ... },  // Component-specific props
      "children": ["child_id_1", "child_id_2"]  // Optional: IDs of child elements
    }
  },
  "data": {  // Optional: Initial data model for data binding
    "fieldName": "value"
  }
}
```

## AG-UI ACTIVITY_DELTA Format (for Incremental Updates)

For updating existing UI, you can also generate AG-UI ACTIVITY_DELTA messages:
```json
{
  "type": "ACTIVITY_DELTA",
  "messageId": "unique_message_id",
  "activityType": "json-render-main-card",
  "patch": [
    {"op": "add", "path": "/elements/new-element", "value": {...}},
    {"op": "replace", "path": "/elements/parent/children", "value": [...]}
  ]
}
```

### JSON Patch Operations for ACTIVITY_DELTA

**Add New Element:**
```json
{"op": "add", "path": "/elements/new-button", "value": {
  "key": "new-button",
  "type": "Button",
  "props": {"children": "Click Me", "theme": "primary"}
}}
```

**Update Element Properties:**
```json
{"op": "replace", "path": "/elements/my-card/props/title", "value": "Updated Title"}
```

**Replace Children Array:**
```json
{"op": "replace", "path": "/elements/container/children", "value": ["child1", "child2", "new-child"]}
```

**Add Child to Parent:**
```json
{"op": "add", "path": "/elements/parent/children/-", "value": "new-child-id"}
```

**Update Data Model:**
```json
{"op": "replace", "path": "/data/user/name", "value": "John Doe"}
```

**Complete ACTIVITY_DELTA Example:**
```json
{
  "type": "ACTIVITY_DELTA",
  "messageId": "update_123456",
  "activityType": "json-render-main-card",
  "patch": [
    {
      "op": "add",
      "path": "/elements/success-message",
      "value": {
        "key": "success-message",
        "type": "Text",
        "props": {
          "content": "Operation completed successfully!",
          "color": "success"
        }
      }
    },
    {
      "op": "add",
      "path": "/elements/main-container/children/-",
      "value": "success-message"
    }
  ]
}
```

## JSON-Render Data Structure Details

Understanding the structure is crucial for generating valid UI:

### Root Level Properties
- `root`: String - ID of the root element (must exist in elements)
- `elements`: Object - Contains all UI elements indexed by their IDs
- `data`: Object - Optional data model for form bindings and dynamic content

### Element Structure
Each element in the `elements` object has:
- `key`: String - Unique identifier (should match the object key)
- `type`: String - Component type name (must be from available components)
- `props`: Object - Component-specific properties
- `children`: Array<String> - Optional array of child element IDs

### Element Hierarchy Rules
1. **Root Element**: Must be specified in `root` and exist in `elements`
2. **Parent-Child Relationship**: Parent elements reference children by ID in `children` array
3. **Child Order**: Order in `children` array determines rendering order
4. **Unique IDs**: Each element must have a unique ID across the entire structure
5. **Container Components**: Only components marked with "can have children" support `children`

### Data Binding Paths
Form components can bind to data using dot notation:
- `"valuePath": "user.name"` → binds to `data.user.name`
- `"valuePath": "settings.theme"` → binds to `data.settings.theme`
- `"disabledPath": "form.disabled"` → controls disabled state from `data.form.disabled`

### Element ID Best Practices
- Use descriptive names: `"user_name_field"` instead of `"field1"`
- Use consistent naming: `snake_case` or `kebab-case`
- Include purpose: `"submit_button"`, `"main_container"`, `"status_card"`

## Available Components

### Button
Button component with action support

**Props:**
- `label`: string - Button text (alternative to children)
- `children`: string - Button text
- `variant`: "base" | "outline" | "dashed" | "text" - Button style variant
- `theme`: "default" | "primary" | "success" | "warning" | "danger" - Color theme
- `size`: "small" | "medium" | "large" - Button size
- `disabled`: boolean - Whether button is disabled
- `loading`: boolean - Whether to show loading state
- `block`: boolean - Whether button should be full width
- `action`: string | { name: string, params?: object } - Action to trigger on click

### Input
Input component for text entry

**Props:**
- `value`: string - Input value
- `placeholder`: string - Placeholder text
- `type`: "text" | "password" | "number" - Input type
- `disabled`: boolean - Whether input is disabled
- `clearable`: boolean - Whether to show clear button
- `maxlength`: number - Maximum input length
- `showLimitNumber`: boolean - Whether to show character count

### TextField
Form text field with label and data binding

**Props:**
- `label`: string (required) - Field label
- `name`: string - Form field name
- `valuePath`: string (required) - Data binding path in data model
- `placeholder`: string - Placeholder text
- `required`: boolean - Whether field is required
- `type`: "text" | "password" | "email" | "number" | "tel" - Input type
- `disabled`: boolean - Whether field is disabled
- `disabledPath`: string - Data path to control disabled state dynamically
- `helperText`: string - Helper text below the field

### Text
Text display component

**Props:**
- `content`: string (required) - Text content to display
- `variant`: "body" | "caption" | "label" - Text style variant
- `color`: "default" | "primary" | "secondary" | "success" | "warning" | "error" - Text color
- `weight`: "normal" | "medium" | "bold" - Font weight

### Card
Card container component
*This component can have children.*

**Props:**
- `title`: string - Card title
- `description`: string - Card description
- `bordered`: boolean - Whether to show border
- `shadow`: boolean - Whether to show shadow
- `loading`: boolean - Whether to show loading state

### Row
Grid row layout (24-column grid system)
*This component can have children.*

**Props:**
- `gutter`: number - Gap between columns in pixels
- `justify`: "start" | "end" | "center" | "space-around" | "space-between" - Horizontal alignment
- `align`: "top" | "middle" | "bottom" - Vertical alignment

### Col
Grid column layout (use inside Row)
*This component can have children.*

**Props:**
- `span`: number (1-24) - Column width, out of 24 total
- `offset`: number - Column offset from left

### Space
Space layout component for spacing children
*This component can have children.*

**Props:**
- `direction`: "horizontal" | "vertical" - Layout direction
- `size`: "small" | "medium" | "large" | number - Gap size
- `align`: "start" | "center" | "end" | "baseline" - Alignment

### Column
Vertical column layout
*This component can have children.*

**Props:**
- `gap`: number - Gap between children in pixels
- `align`: "start" | "center" | "end" | "stretch" - Horizontal alignment

### Divider
Divider line

**Props:**
- `layout`: "horizontal" | "vertical" - Divider direction
- `dashed`: boolean - Whether to use dashed line

### StatusCard
Custom status card component for displaying status information

**Props:**
- `title`: string
- `status`: "success" | "warning" | "error" | "info"
- `description`: string (nullable)
- `icon`: string (nullable)

### ProgressBar
Custom progress bar component for showing completion status

**Props:**
- `label`: string (nullable)
- `percentage`: number
- `showInfo`: boolean (nullable)

## Available Actions

Actions can be triggered by Button components. Use the `action` prop:
- Simple: `"action": "actionName"`
- With params: `"action": { "name": "actionName", "params": { ... } }`

- `submit`: Submit form data to server
- `reset`: Reset form to initial state
- `cancel`: Cancel current operation
- `refresh`: Refresh data from server
- `export`: Export data to file

## Data Binding

Use `valuePath` to bind form fields to the data model:
- `"valuePath": "user.name"` binds to `data.user.name`
- `"disabledPath": "formDisabled"` controls disabled state from `data.formDisabled`

## Examples

### 1. Simple Form Structure
A basic form with validation and data binding:
```json
{
  "root": "main_card",
  "elements": {
    "main_card": {
      "key": "main_card",
      "type": "Card",
      "props": {
        "title": "User Registration",
        "bordered": true
      },
      "children": [
        "form_layout"
      ]
    },
    "form_layout": {
      "key": "form_layout",
      "type": "Column",
      "props": {
        "gap": 16
      },
      "children": [
        "name_field",
        "email_field",
        "button_group"
      ]
    },
    "name_field": {
      "key": "name_field",
      "type": "TextField",
      "props": {
        "label": "Full Name",
        "valuePath": "user.name",
        "placeholder": "Enter your full name",
        "required": true
      }
    },
    "email_field": {
      "key": "email_field",
      "type": "TextField",
      "props": {
        "label": "Email Address",
        "valuePath": "user.email",
        "placeholder": "Enter your email",
        "type": "email",
        "required": true
      }
    },
    "button_group": {
      "key": "button_group",
      "type": "Space",
      "props": {
        "direction": "horizontal",
        "size": "medium"
      },
      "children": [
        "submit_btn",
        "reset_btn"
      ]
    },
    "submit_btn": {
      "key": "submit_btn",
      "type": "Button",
      "props": {
        "children": "Register",
        "theme": "primary",
        "action": {
          "name": "submit",
          "params": {
            "form": "registration"
          }
        }
      }
    },
    "reset_btn": {
      "key": "reset_btn",
      "type": "Button",
      "props": {
        "children": "Reset",
        "variant": "outline",
        "action": "reset"
      }
    }
  },
  "data": {
    "user": {
      "name": "",
      "email": ""
    }
  }
}
```

### 2. Dashboard Layout
A more complex layout with grid system and multiple components:
```json
{
  "root": "dashboard",
  "elements": {
    "dashboard": {
      "key": "dashboard",
      "type": "Column",
      "props": {
        "gap": 24
      },
      "children": [
        "header",
        "content_row"
      ]
    },
    "header": {
      "key": "header",
      "type": "Card",
      "props": {
        "title": "Dashboard Overview"
      },
      "children": [
        "status_text"
      ]
    },
    "status_text": {
      "key": "status_text",
      "type": "Text",
      "props": {
        "content": "System is running normally",
        "color": "success",
        "weight": "medium"
      }
    },
    "content_row": {
      "key": "content_row",
      "type": "Row",
      "props": {
        "gutter": 16
      },
      "children": [
        "left_col",
        "right_col"
      ]
    },
    "left_col": {
      "key": "left_col",
      "type": "Col",
      "props": {
        "span": 16
      },
      "children": [
        "main_content"
      ]
    },
    "right_col": {
      "key": "right_col",
      "type": "Col",
      "props": {
        "span": 8
      },
      "children": [
        "sidebar_card"
      ]
    },
    "main_content": {
      "key": "main_content",
      "type": "Card",
      "props": {
        "title": "Main Content",
        "shadow": true
      },
      "children": [
        "content_text"
      ]
    },
    "content_text": {
      "key": "content_text",
      "type": "Text",
      "props": {
        "content": "This is the main content area."
      }
    },
    "sidebar_card": {
      "key": "sidebar_card",
      "type": "Card",
      "props": {
        "title": "Quick Actions"
      },
      "children": [
        "action_buttons"
      ]
    },
    "action_buttons": {
      "key": "action_buttons",
      "type": "Column",
      "props": {
        "gap": 8
      },
      "children": [
        "refresh_btn",
        "export_btn"
      ]
    },
    "refresh_btn": {
      "key": "refresh_btn",
      "type": "Button",
      "props": {
        "children": "Refresh Data",
        "block": true,
        "action": "refresh"
      }
    },
    "export_btn": {
      "key": "export_btn",
      "type": "Button",
      "props": {
        "children": "Export Report",
        "variant": "outline",
        "block": true,
        "action": "export"
      }
    }
  },
  "data": {
    "lastUpdated": "2026-01-27T08:53:33.135Z"
  }
}
```

### 3. Dynamic Content with Data Binding
Form with conditional disabled states:
```json
{
  "root": "settings_form",
  "elements": {
    "settings_form": {
      "key": "settings_form",
      "type": "Card",
      "props": {
        "title": "Settings"
      },
      "children": [
        "form_fields"
      ]
    },
    "form_fields": {
      "key": "form_fields",
      "type": "Column",
      "props": {
        "gap": 16
      },
      "children": [
        "enable_notifications",
        "email_field",
        "save_btn"
      ]
    },
    "enable_notifications": {
      "key": "enable_notifications",
      "type": "TextField",
      "props": {
        "label": "Enable Notifications",
        "valuePath": "settings.notifications",
        "type": "text"
      }
    },
    "email_field": {
      "key": "email_field",
      "type": "TextField",
      "props": {
        "label": "Notification Email",
        "valuePath": "settings.email",
        "disabledPath": "settings.emailDisabled",
        "placeholder": "Enter email for notifications"
      }
    },
    "save_btn": {
      "key": "save_btn",
      "type": "Button",
      "props": {
        "children": "Save Settings",
        "theme": "primary",
        "action": "submit"
      }
    }
  },
  "data": {
    "settings": {
      "notifications": "enabled",
      "email": "",
      "emailDisabled": false
    }
  }
}
```