var vm = new Vue({
    el: '#giphysorter',
    data:{
        searchCount: 0,
        selected: [],
        searchResults: [],
        highlightedResultIndex: 0,
        api_key: 'ZZPUvuQl7b1RGfjQ4Q6adTmfj92fQd50',
        searchUrl: 'https://api.giphy.com/v1/gifs/search',
        imgVersion: 'fixed_width_still',
        imgHoverVersion: 'fixed_width',
        removedImageResults: {img:null, index:null}, //most recently removed image, to allow for undo
        removedImageSelected: {img:null, index:null} //most recently removed image, to allow for undo
    },
    watch: {
        /**
         * When adding/removing items from the searchResults, make sure that
         * accompanying state variables stay within bounds. 
         * In particular, if the last element is removed make sure that the highlighted
         * image is shifted to within bounds. While this could be accomplished by manually
         * checking and resetting it in the 'removeFromResults' and 'addToSelection' methods,
         * doing it here makes sure that no other edge cases in the future fall through the cracks.
         */
        searchResults: function(){
            this.validateHighlight();
        }
    },
    methods:{
        /**
        * Queries the Giphy API search endpoint. Upon successful 
        * result, the data.searchResult array is updated with the
        * results of the search.

        * event: the javascript event that triggered the search, used to 
        *        access the search terms in the 'input' search bar.
        */
        search: function(event){
            var searchTerms = event.target.value;

            $.ajax({
              dataType: "json",
              type: "get",
              url: this.searchUrl,
              data: {
                api_key:this.api_key,
                q: searchTerms,
                limit: 10,
                rating:"pg"
              },
              success: function(response){
                $('#searchbar').blur(); //makes arrow key functionality immediately available
                vm.searchCount++;
                vm.highlightedResultIndex = 0;
                vm.searchResults = response.data;
                console.log(vm.searchResults);


              },
              error: function(){
                //TODO real error handling
                console.log("there was an error");
              }
            });
        },
        /**
         * Resets the searchResults data variable to an empty array
         * Attached to a user input 'clear' button

         * event: the javascript event that triggered the clear (not currently used)
         */
        clearSearch: function(event){
            this.searchResults = [];
        },
        /**
         * Within the search results, one of the images is the highlighted/selected
         * image at any given point in time. This function moves the highlighter
         * one image to the left or right if possible. Keeps the highlighter within
         * bounds of the searchResults array, so it's safe to call this function
         * when it would improperly move the highlighter out of the array (i.e. when
         * hitting the left arrow when already on the first element)

         * direction: a string of either '+' or '-' indicating the direction to increment
         */
        incrementHighlight: function(direction){
            if (this.searchResults.length > 0){ //only act if we could highlight something
                if (direction =="+"){
                    if (this.highlightedResultIndex < (this.searchResults.length - 1)){ //keep highlight within the results bounds
                        this.highlightedResultIndex++;
                    };
                } else if (direction == "-"){
                    if (this.highlightedResultIndex > 0){ //keep highlight within results bounds
                        this.highlightedResultIndex--;
                    };
                } else {
                    console.log("incrementHighlight parameter error - should be '+' or '-'.");
                };
            };
        },
        /**
         * Moves the higlightedResultIndex directly to the desired index.
         * 
         * i: index to assign to the highlight
         */
        moveHighlight: function(i){
            this.highlightedResultIndex = i;
        },
        /** 
         * Performs data validation on the highlightedResultIndex to make sure it's within bounds
         * Called when the searchResults are changed or the highlighted index is changed.
         */
        validateHighlight: function(){
            //Handles the case of when we remove the last item
            if (this.searchResults.length == 0){
                this.highlightedResultIndex = 0;
            } else if (this.highlightedResultIndex >= this.searchResults.length){
                this.highlightedResultIndex = (this.searchResults.length -1);
            } else if (this.highlightedResultIndex < 0){
                this.highlightedResultIndex = 0;
            };
        },
        /*
         * Removes the selected index from the searchResults array
         * 
         * i: the index of the searchResults array of the element to be removed
         */
        removeFromResults: function (i){
            //TODO test what happens when search results are empty
            if (i >= 0 && i < this.searchResults.length){
                //cache most recently removed to allow for a single-level ctrl+z
                var img = this.searchResults[i];
                this.removedImageResults = {
                    img: img,
                    index: i
                };

                //remove the image
                this.searchResults.splice(i,1);
            } else {
                console.log("removeFromResults index out of bounds")
            };
        },
        /**
         * Undoes the most recent 'removeFromResults' action. Attached to the ctrl+z
         * keypress. Also resets the removedImageResults cache to prevent double add
         *
         * img: the img object (in the form returned by the giphy api) to be restored
         * i:   The index within the searchResults array of where to place the restored img
         */
        restoreToResults: function(img,i){
            if (this.removedImageResults.img != null && this.removedImageResults.index != null){
                this.searchResults.splice(i,0,img);
                //remove cache to prevent double adding
                this.removedImageResults = {img:null, index:null};
            };
        },
        /**
         * "Moves" an image to the 'favorites' list (data.selected array)
         * 
         * img: the img object (in the form returned by the giphy api)
         * i:   the index within the searchResults of where the img is currently, so it can be removed
         */
        addToSelection: function(img,i){
            this.selected.push(img);
            this.searchResults.splice(i,1); //"moves" the image instead of duplicating
        },
        /**
         * Removes an item from the data.selected list (the 'favorites' section)
         *
         * img: the img object (in the form returned by the giphy api) (currently not used)
         * event: the javascript event that triggered the removal (currently not used)
         * i: the index within the data.selected array of the element to be removed
         */
        removeFromSelection: function(img,event,i){
            this.selected.splice(i,1); //remove element at position i
        },
        /**
         * Switches the image being hovered between the two image versions. 
         * image versions config is stored in data.imgVersion and data.imgHoverVersion
         *
         * img: the img object (in the form returned by the giphy api). Used to get the 
                image urls for the specific image
           event: the javascript event that triggered removal, used to access the event.target
                  and switch the src= attribute
           i: the index within the data.searchResults (currently not used)
           */
        toggleHover: function(img,event,isHovered){
            var imgType = (isHovered == 1) ? this.imgHoverVersion : this.imgVersion;
            event.target.src = img.images[imgType].url
        }
        
    }

});

//Add Global listeners for key press
/* When the user has search results available, we want to be able to sort them with 
 * the keyboard to make reviewing the resulting images quick. 
 * - left/right arrow keys move the selected image higlighter
 * - up arrow key moves items into the data.selected list (the 'favorites' section)
 * - down arrow key deletes an item from the searchResults, to remove clutter of undesireable images
 * - ctrl+z adds a (very basic) undo function for removal. 
 */
window.addEventListener('keydown',function(event){
    
    if (event.target.tagName != "INPUT") { //don't want to keypresses to act if we're typing
        if (event.key == "ArrowLeft"){
            vm.incrementHighlight('-');
        } else if (event.key == "ArrowRight"){
            vm.incrementHighlight('+');
        } else if (event.key == "ArrowUp") {
            if (vm.searchResults.length > 0){
                var img = vm.searchResults[vm.highlightedResultIndex];
                var i = vm.highlightedResultIndex;
                vm.addToSelection(img, i);
            };
        } else if (event.key == "ArrowDown") {
            if (vm.searchResults.length > 0){
                vm.removeFromResults(vm.highlightedResultIndex);
            };
        } else if (event.key == "z" && event.ctrlKey) {
            event.preventDefault(); //in this app, this just disables undoing typing in the search bar
            //TODO check if we have most recently removed from the search results or the selected
            var img = vm.removedImageResults.img
            var index = vm.removedImageResults.index
            vm.restoreToResults(img, index);
        } 
    }
});
