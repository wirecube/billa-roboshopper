# Billa Roboshopper

This is a script that will add items to your cart on the Billa Online Shop website.
The items to add are specified in a JSON file called `shopping-list.json`.
There is also a environment file `.env` where you need to specify your Billa login credentials.

## How to use it:

1. Install [Node 20](https://nodejs.org/en/download)
2. Clone the repository
3. Create a `.env` file and set the variables (see the `.env.example` file for reference)
4. Modify the `shopping-list.json` file to add the items you want to add to your cart, the structure looks like this:

```json
[
  {
    "url": "URL of the billa product detail page",
    "quantity": "Desired quantity",
  }
]
```

5. Run the batch script `billa-roboshopper.bat`

### Setting up fallback items:

The script also supports fallback items, which means that if the item is not available, it will try to add the fallback item instead. To use this feature, add a `fallback` property to the item object, like this:

```json
[
  {
    "url": "URL of the billa product detail page",
    "quantity": "Desired quantity",
    "fallback": {
      "url": "URL of the billa product detail page",
      "quantity": "Desired quantity",
      // This could also have a fallback property, and so on...   
    }
  }
]
```
