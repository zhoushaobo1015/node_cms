const app = {
    toggle: function(el,collectionName,attr,id){
        $.get('/admin/changeStatus',{collectionName,attr,id}, (res)=>{
            if(res.status === 200) {
                window.location.reload();
            }
        })
    },
    changeSort: function(el,collectionName,attr,id){
        $.post('/admin/changeSort',{value: el.value, collectionName, attr, id},(res)=>{console.log(res)})
    }
}