function show_hide_clauses(a){
    a.val()!=""?a.parent().next("span").show().next("span").show():a.parent().next("span").hide().next("span").hide()
    }
    $(document).ready(function(){
    $(".referenced_column_dropdown").each(function(a,b){
        show_hide_clauses($(b))
        });
    $(".referenced_column_dropdown").change(function(){
        show_hide_clauses($(this))
        })
    });
