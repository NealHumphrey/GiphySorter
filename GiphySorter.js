var vm = new Vue({
    el: '#giphysorter',
    data:{
        selected: [],
        searchResults: [],
        searchResultUrls: [],
        api_key: 'ZZPUvuQl7b1RGfjQ4Q6adTmfj92fQd50',
        searchUrl: 'https://api.giphy.com/v1/gifs/search',
        imgVersion: 'fixed_width_still',
        imgHoverVersion: 'fixed_width'
    },
    methods:{
        addToSelection: function(img,event){
            this.selected.push(img);
            console.log(event);
        },
        toggleHover: function(img,event,isHovered){
            var imgType = (isHovered == 1) ? this.imgHoverVersion : this.imgVersion;
            event.target.src = img.images[imgType].url
        },
        /**
        * Queries the Giphy API search endpoint. Upon successful 
        * result, the data.searchResult array is updated with the
        * results of the search.
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
                vm.searchResults = response.data;
                console.log(vm.searchResults);

                //TODO put this into a Watch instead
                vm.extractUrls(vm.imgVersion);
              },
              error: function(){
                //TODO real error handling
                console.log("there was an error");
              }
            });
        },
        /**
        * DEPRECATED - remove if not used later
        * Converts the current contents of data.searchResults
        * and extracts the url based on which image version
        * is desired. searchResults returned from the giphy  
        * API contain numerous image versions, stored in the form 
        * result.images.<imageVersion>.url
        */
        extractUrls: function(imgVersion){
            var result = [];
            for (var i = 0; i < this.searchResults.length; i++){
                var img = this.searchResults[i].images[imgVersion]
                result.push(img.url)
            };
            this.searchResultUrls = result;
        }
    }
});
