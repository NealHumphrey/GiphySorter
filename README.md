# GiphySorter
A small app that allows users to sort and save results from the Giphy API. Built in Vue.js for a coding challenge. This was my first app in Vue.js.

## Live Demo:
Check out a live demo of the app on my website: http://nhumphrey.com/projects/giphysorter/app

## Requirements:
This was built for a job interview coding challenge. Requirements:
- Use a Javascript framework, preferably Vue.js
- Have a searchbar. When a user hits enter, display at least 3 different gifs from the Giphy API
- Only show PG rated gifs
- Make it mobile and tablet friendly using a CSS framework

## Limitations:

Obviously this was built as a quick demonstration app, not a fully functioning website. A few key next steps that I would work on if I were making it into a finished project:
- Vue.js code structure uses just one simple `vm` object; a component based architecture with proper build tools would be better if this needed to be maintained in any way. 
- No unit tests are included; there are several functions that deserve to be unit tested, especially since some of the UI logic expects the `searchResults` array to be in a certain format.
- Transitions/animations would make this a lot prettier
- Pagination of search results to allow users to find more gifs with the same search term
- Mobile functionality is not well designed - I wrote this as a desktop-first app. While Bootstrap allows the three column layout to resize and reorder, a different mobile interface would be better.
- The 'saved gifs' functionality isn't built out further - there's nothing that a user can do once they save a gif. The most obvious addition would be viewing the saved gif in the preview pane (probably by clicking on it) - this would let you also get the gif url. I decided to only build the option for users to preview the searched gifs for simplicity of implementation.
