# Resume

Basic JSON resume rendering script.

> Made before discovering JSON Resume project... 🤦‍♂️

## Status

This project is a WIP and does not offer any interfaces currently. It has been made in around 2 days / nights.

## Notes

As this project has been made before discovering the [JSON Resume project](https://jsonresume.org), it is completely useless...

But, you are still free to use it.

## Schema

The current schema is __similar but not compatible__ with the [JSON Resume schema](https://jsonresume.org/schema).

> I'll try to make it compatible at some point but it's not the priority for the moment.

```json
{
  "meta": {
    "theme": "default"
  },
  "basics": {
    "name": "Jiab77",
    "label": "System / Web / Network / Security",
    "image": "",
    "email": "REDACTED",
    "phone": "REDACTED",
    "url": "https://jiab77.github.io",
    "summary": "Ethical hacking, development and security research",
    "location": {
      "address": "REDACTED",
      "postalCode": "REDACTED",
      "city": "REDACTED",
      "countryCode": "REDACTED",
      "region": "REDACTED"
    },
    "profiles": [
      {
        "network": "Twitter",
        "username": "Jiab77",
        "url": "https://twitter.com/jiab77"
      },
      {
        "network": "GitHub",
        "username": "Jiab77",
        "url": "https://github.com/jiab77"
      }
    ]
  },
  "status": {
      "dob": "REDACTED",
      "nationality": "French",
      "life": "REDACTED",
      "paper": "REDACTED"
  },
  "sections": [
    {
      "title": "Professional Experience",
      "entries": [
        {
          "company": "",
          "position": "",
          "location": "",
          "range": {
            "start": "",
            "end": ""
          },
          "activities": [
            {
              "domain": "",
              "tasks": []
            }
          ]
        }
      ]
    },
    {
      "title": "Other Experiences",
      "entries": [
        {
          "company": "",
          "position": "",
          "location": "",
          "range": {
            "start": "",
            "end": ""
          },
          "activities": [
            {
              "domain": "",
              "tasks": []
            }
          ]
        }
      ]
    },
    {
      "title": "Certifications",
      "entries": [
        {
          "date": "",
          "name": ""
        }
      ]
    },
    {
      "title": "Exams",
      "entries": [
        {
          "date": "",
          "name": ""
        }
      ]
    },
    {
      "title": "Languages",
      "entries": [
        {
          "name": "English",
          "level": "Level B2"
        },
        {
          "name": "French",
          "level": "Native language"
        }
      ]
    },
    {
      "title": "Technical Skills",
      "entries": [
        {
          "domain": "",
          "activities": [
            {
              "name": "",
              "description": ""
            }
          ]
        }
      ]
    },
    {
      "title": "Interests",
      "entries": [
        {
          "name": ""
        }
      ]
    }
  ]
}
```


## Usage

Edit the config part at the top of the [resume.js](resume.js) file:

```js
// Config
const dataFile = 'resume.json';

// Options
const options = {
    "debugMode": true
};

// Features
const features = {
    "md": true,
    "html": true,
    "docx": false
};
```

Set `dataFile` with the path to the `JSON` file to be parsed and rendered in Markdown and HTML formats. (_both formats are currently enabled by default_)

Once done, save your changes and run the script that way:

```console
$ ./resume.js
```

You should find the created files in the same folder as the `JSON` parsed file.

## Author

* __Jiab77__