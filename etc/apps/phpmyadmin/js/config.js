var defaultValues={},PMA_messages={};

function getFieldType(a){
    a=$(a);
    var b=a.attr("tagName");
    if(b=="INPUT")return a.attr("type");
    else if(b=="SELECT")return"select";
    else if(b=="TEXTAREA")return"text";
    return""
    }
function setFieldValue(a,b,d){
    a=$(a);
    switch(b){
        case "text":
            a.attr("value",d!=undefined?d:a.attr("defaultValue"));
            break;
        case "checkbox":
            a.attr("checked",d!=undefined?d:a.attr("defaultChecked"));
            break;
        case "select":
            b=a.attr("options");
            var c,e=b.length;
            if(d==undefined)for(c=0;c<e;c++)b[c].selected=b[c].defaultSelected;else for(c=0;c<e;c++)b[c].selected=d.indexOf(b[c].value)!=-1
            }
            markField(a)
    }
function getFieldValue(a,b){
    a=$(a);
    switch(b){
        case "text":
            return a.attr("value");
        case "checkbox":
            return a.attr("checked");
        case "select":
            var d=a.attr("options"),c,e=d.length,f=[];
            for(c=0;c<e;c++)d[c].selected&&f.push(d[c].value);
            return f
            }
            return null
    }
    function getAllValues(){
    for(var a=$("fieldset input, fieldset select, fieldset textarea"),b={},d,c,e=0;e<a.length;e++){
        d=getFieldType(a[e]);
        c=getFieldValue(a[e],d);
        if(typeof c!="undefined"){
            if(d=="select")c=c[0];
            b[a[e].name]=c
            }
        }
    return b
}
function checkFieldDefault(a,b){
    a=$(a);
    var d=a.attr("id");
    if(typeof defaultValues[d]=="undefined")return true;
    var c=true,e=getFieldValue(a,b);
    if(b!="select")c=e==defaultValues[d];
    else if(e.length!=defaultValues[d].length)c=false;else for(var f=0;f<e.length;f++)if(e[f]!=defaultValues[d][f]){
        c=false;
        break
    }
    return c
    }
    function getIdPrefix(a){
    return $(a).attr("id").replace(/[^-]+$/,"")
    }
var validate={},validators={
    _regexp_numeric:/^[0-9]+$/,
    _regexp_pcre_extract:/(.)(.*)\1(.*)?/,
    validate_positive_number:function(a){
        if(a&&this.value=="")return true;
        return this.value!="0"&&validators._regexp_numeric.test(this.value)?true:PMA_messages.error_nan_p
        },
    validate_non_negative_number:function(a){
        if(a&&this.value=="")return true;
        return validators._regexp_numeric.test(this.value)?true:PMA_messages.error_nan_nneg
        },
    validate_port_number:function(){
        if(this.value=="")return true;
        return validators._regexp_numeric.test(this.value)&&
        this.value!="0"&&this.value<=65535?true:PMA_messages.error_incorrect_port
        },
    validate_by_regex:function(a,b){
        if(a&&this.value=="")return true;
        var d=b.match(validators._regexp_pcre_extract);
        return this.value.match(RegExp(d[2],d[3]))!=null?true:PMA_messages.error_invalid_value
        },
    validate_upper_bound:function(a,b){
        var d=parseInt(this.value);
        if(isNaN(d))return true;
        return d<=b?true:PMA_messages.error_value_lte.replace("%s",b)
        },
    _field:{},
    _fieldset:{}
};
function validateField(a,b,d,c){
    if(typeof validators[b]!="undefined"){
        if(typeof validate[a]=="undefined")validate[a]=[];
        validate[a].push([b,c,d])
        }
    }
function getFieldValidators(a,b){
    var d=a.match(/[^-]+$/)[0];
    if(typeof validators._field[d]!="undefined")return[[validators._field[d],null]];
    d=[];
    if(typeof validate[a]!="undefined")for(var c=0,e=validate[a].length;c<e;c++)b&&!validate[a][c][2]||d.push([validators[validate[a][c][0]],validate[a][c][1]]);
    return d
    }
function displayErrors(a){
    for(var b in a){
        var d=a[b],c=$("#"+b),e=c.attr("tagName")=="FIELDSET",f=e?c.find("dl.errors"):c.siblings(".inline_errors");
        d=$.grep(d,function(h){
            return h!=""
            });
        e||(c.attr("type")=="checkbox"?c.parent():c)[d.length?"addClass":"removeClass"]("field-error");
        if(d.length){
            if(f.length==0)if(e){
                f=$('<dl class="errors" />');
                c.find("table").before(f)
                }else{
                f=$('<dl class="inline_errors" />');
                c.closest("td").append(f)
                }
                c="";
            e=0;
            for(var g=d.length;e<g;e++)c+="<dd>"+d[e]+"</dd>";
            f.html(c)
            }else f!==
            null&&f.remove()
            }
        }
    function validate_fieldset(a,b,d){
    a=$(a);
    if(a.length&&typeof validators._fieldset[a.attr("id")]!="undefined"){
        a=validators._fieldset[a.attr("id")].apply(a[0],[b]);
        for(var c in a){
            if(typeof d[c]=="undefined")d[c]=[];
            if(typeof a[c]=="string")a[c]=[a[c]];
            $.merge(d[c],a[c])
            }
        }
        }
function validate_field(a,b,d){
    a=$(a);
    var c=a.attr("id");
    d[c]=[];
    for(var e=getFieldValidators(c,b),f=0;f<e.length;f++){
        var g=e[f][1]!=null?e[f][1].slice(0):[];
        g.unshift(b);
        g=e[f][0].apply(a[0],g);
        if(g!==true){
            if(typeof g=="string")g=[g];
            $.merge(d[c],g)
            }
        }
    }
function validate_field_and_fieldset(a,b){
    a=$(a);
    var d={};
    
    validate_field(a,b,d);
    validate_fieldset(a.closest("fieldset"),b,d);
    displayErrors(d)
    }
function markField(a){
    a=$(a);
    var b=getFieldType(a),d=checkFieldDefault(a,b);
    b=b=="checkbox"?a.parent():a;
    setRestoreDefaultBtn(a,!d);
    b[d?"removeClass":"addClass"]("custom")
    }
    function setRestoreDefaultBtn(a,b){
    $(a).closest("td").find(".restore-default img")[b?"show":"hide"]()
    }
$(function(){
    var a=$("input[id], select[id], textarea[id]");
    $("input[id], select[id], textarea[id]").each(function(){
        markField(this);
        var c=$(this);
        c.bind("change",function(){
            validate_field_and_fieldset(this,false);
            markField(this)
            });
        var e=c.attr("tagName");
        e=="INPUT"&&c.attr("type")=="text"&&c.keyup(function(){
            validate_field_and_fieldset(c,true);
            markField(c)
            });
        e=="TEXTAREA"&&c.attr("spellcheck",false)
        });
    var b=$("#check_page_refresh");
    if(b.length==0||b.val()=="1"){
        var d={};
        
        for(b=0;b<a.length;b++)validate_field(a[b],
            false,d);
        $("fieldset").each(function(){
            validate_fieldset(this,false,d)
            });
        displayErrors(d)
        }else b&&b.val("1")
        });
function setTab(a){
    $(".tabs a").removeClass("active").filter("[href="+a+"]").addClass("active");
    $(".tabs_contents fieldset").hide().filter(a).show();
    location.hash="tab_"+a.substr(1);
    $(".config-form input[name=tab_hash]").val(location.hash)
    }
$(function(){
    var a=$(".tabs");
    if(a.length){
        a.find("a").click(function(d){
            d.preventDefault();
            setTab($(this).attr("href"))
            }).filter(":first").addClass("active");
        $(".tabs_contents fieldset").hide().filter(":first").show();
        var b;
        a=function(){
            if(location.hash!=b){
                b=location.hash;
                location.hash.match(/^#tab_.+/)&&$("#"+location.hash.substr(5)).length&&setTab("#"+location.hash.substr(5))
                }
            };
        
    a();
    setInterval(a,200)
    }
});
$(function(){
    $("input[type=button][name=submit_reset]").click(function(){
        for(var a=$(this).closest("fieldset").find("input, select, textarea"),b=0,d=a.length;b<d;b++)setFieldValue(a[b],getFieldType(a[b]))
            })
    });
function restoreField(a){
    var b=$("#"+a);
    b.length==0||defaultValues[a]==undefined||setFieldValue(b,getFieldType(b),defaultValues[a])
    }
$(function(){
    $(".tabs_contents").delegate(".restore-default, .set-value","mouseenter",function(){
        $(this).css("opacity",1)
        }).delegate(".restore-default, .set-value","mouseleave",function(){
        $(this).css("opacity",0.25)
        }).delegate(".restore-default, .set-value","click",function(a){
        a.preventDefault();
        var b=$(this).attr("href");
        if($(this).hasClass("restore-default")){
            a=b;
            restoreField(a.substr(1))
            }else{
            a=b.match(/^[^=]+/)[0];
            b=b.match(/=(.+)$/)[1];
                setFieldValue($(a),"text",b)
                }
                $(a).trigger("change")
            }).find(".restore-default, .set-value").css({
        display:"inline-block",
        opacity:0.25
    })
    });
$(function(){
    offerPrefsAutoimport();
    var a=$("#import_local_storage, #export_local_storage");
    if(a.length){
        a.attr("disabled",false).add("#export_text_file, #import_text_file").click(function(){
            var c=$(this).attr("id"),e=c.match(/local_storage$/)?c.replace(/local_storage$/,"text_file"):c.replace(/text_file$/,"local_storage");
            $("#opts_"+e).addClass("disabled").find("input").attr("disabled",true);
            $("#opts_"+c).removeClass("disabled").find("input").attr("disabled",false)
            });
        var b=window.localStorage||false,
        d=b?window.localStorage.config||false:false;
        $(".localStorage-"+(b?"un":"")+"supported").hide();
        $(".localStorage-"+(d?"empty":"exists")).hide();
        d&&updatePrefsDate();
        $("form.prefs-form").change(function(){
            var c=$(this),e=false;
            if(b){
                if(!d&&c.attr("name")=="prefs_import"&&$("#import_local_storage")[0].checked)e=true
                    }else e=c.find("input[type=radio][value$=local_storage]").attr("checked");
            c.find("input[type=submit]").attr("disabled",e)
            }).submit(function(c){
            var e=$(this);
            if(e.attr("name")=="prefs_export"&&
                $("#export_local_storage")[0].checked){
                c.preventDefault();
                savePrefsToLocalStorage(e)
                }else e.attr("name")=="prefs_import"&&$("#import_local_storage")[0].checked&&e.find("input[name=json]").val(window.localStorage.config)
                });
        $(".click-hide-message").live("click",function(){
            var c=$(this);
            c.hide().parent(".group").css("height","");
            c.next("form").show()
            })
        }
    });
function savePrefsToLocalStorage(a){
    a=$(a);
    var b=a.find("input[type=submit]");
    b.attr("disabled",true);
    $.ajax({
        url:"prefs_manage.php",
        cache:false,
        type:"POST",
        data:{
            token:a.find("input[name=token]").val(),
            submit_get_json:true
        },
        success:function(d){
            window.localStorage.config=d.prefs;
            window.localStorage.config_mtime=d.mtime;
            window.localStorage.config_mtime_local=(new Date).toUTCString();
            updatePrefsDate();
            $(".localStorage-empty").hide();
            $(".localStorage-exists").show();
            d=a.parent(".group");
            d.css("height",
                d.height()+"px");
            a.hide("fast");
            a.prev(".click-hide-message").show("fast")
            },
        complete:function(){
            b.attr("disabled",false)
            }
        })
}
function updatePrefsDate(){
    var a=PMA_messages.strSavedOn.replace("@DATE@",formatDate(new Date(window.localStorage.config_mtime_local)));
    $("#opts_import_local_storage .localStorage-exists").html(a)
    }
function formatDate(a){
    return a.getFullYear()+"-"+(a.getMonth()<10?"0"+a.getMonth():a.getMonth())+"-"+(a.getDate()<10?"0"+a.getDate():a.getDate())+" "+(a.getHours()<10?"0"+a.getHours():a.getHours())+":"+(a.getMinutes()<10?"0"+a.getMinutes():a.getMinutes())
    }
function offerPrefsAutoimport(){
    var a=(window.localStorage||false)&&(window.localStorage.config||false),b=$("#prefs_autoload");
    if(b.length&&a){
        b.find("a").click(function(d){
            d.preventDefault();
            if($(this).attr("href")=="#no"){
                b.remove();
                $.post("main.php",{
                    token:b.find("input[name=token]").val(),
                    prefs_autoload:"hide"
                })
                }else{
                b.find("input[name=json]").val(window.localStorage.config);
                b.find("form").submit()
                }
            });
    b.show()
    }
};
