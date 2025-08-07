# Icon Components

This folder holds typescript elements that allow for responsive sizing and consisent appearence within Helios-v3.

## How to Add Icon

> File names are based on icon type. For example Chevron - up, down, left, right, etc... are all in chevron.tsx

1. Add the path string to, or create new icon class for the specific icone type. This string will be referenced by the `HeliosIcon` component defined by `index.js`

Example:

```json
{
  "chevron": {
    "up": "M4.5 15.75l7.5-7.5 7.5 7.5",
    "down": "M19.5 8.25l-7.5 7.5-7.5-7.5",
    {...}
    "NEW_ICON": <PATH STRING HERE>
  }
```

2. Add the following line under the `Components` comment label in whichever file you would like to add an icon to

Example:

```javascript
/*---------------------Components-----------------------*/
{...}
import HeliosIcons from "@/Global/icons"
     <HeliosIcons
        icon_class={"chevron"}
        icon_type={"up"}
        color={"secondary"}
        stroke={"stroke-accent"}
      />
```

3. Use the component and pass in necessary props
