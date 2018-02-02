var vm = new Vue({
    el: '#giphysorter',
    data:{
        selected: ["img1","img2"]
    },
    methods:{
        addItem: function() {
            this.selected.push('img')
        }
    }
});