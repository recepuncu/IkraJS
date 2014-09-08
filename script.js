var jsBugun = new Date();

$(function () {
    $.datepicker.regional['tr'] = {
        closeText: 'kapat',
        prevText: '&#x3c;geri',
        nextText: 'ileri&#x3e',
        currentText: 'bugün',
        monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
        'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        dayNamesShort: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
        dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
        weekHeader: 'Hf',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['tr']);
    
    $("input.takvim").datepicker({
        //minDate: jsBugun,
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: "dd.mm.yy",
        duration: "fast"
    });

    //$(".uniform").uniform();

});

Eklenti = {
    Takvim: function (Id, DateFormat) {
        /// <summary>Input nesnesini datepicker yapar.</summary>
        /// <param name="Id" type="String">#[id] yada string ifade girilebilir.</param>
        /// <param name="DateFormat" type="String">Görünmesini istediğiniz tarih formatı</param>
        /// <returns type="Datepicker">Datepicker nesnesinin özelliklerini verir.</returns>
        
        $(Id).datepicker({
            //minDate: jsBugun,
            changeMonth: true,
            changeYear: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: DateFormat ? DateFormat : "dd.mm.yy"
        });

        return $(Id);
    },
    CheckboxVal: function (Id) {
        /// <summary>Checkbox nesnesinin değerini verir.</summary>
        /// <param name="Id" type="String">#[id] yada string ifade girilebilir.</param>
        /// <returns type="string">Checkbox nesnesinin değerini verir.</returns>
        return $(Id).is(':checked') ? $(Id).val() : "0"
    },
    FormDogrula: function (Fields) {
        
        var dizi = {},
            netice = true;

        var mesaj = function(str){
            var div = $('<div/>');
            div.addClass('FormDogrula');
            div.html(str);
            return div;
        };

        var dogrula = function($nesne){
            zorunlu = $nesne.attr('required');

            var id = '#' + $nesne.attr('id'),
                            tip = $nesne.attr('type'),
                            fieldValue = (tip == 'checkbox') ? Eklenti.CheckboxVal(id) : $nesne.val();
            
            if (zorunlu == 'required') {

                if (fieldValue != '') {
                    $('div.' + $nesne.attr('id')).remove();
                    netice = (netice == false) ? false : true;
                } else {
                    if (!$('div').hasClass($nesne.attr('id'))) {
                        mesaj('*').addClass($nesne.attr('id')).insertAfter($nesne);
                    }
                    netice = false;
                }

            } else {
                netice = (netice == false) ? false : true;
            }

            return fieldValue ? fieldValue : null;
        };

        $.each(Fields, function (i, field) {
            dizi[i] = dogrula(field);
        });
        
        if (netice == false) {
            return false;
        } else {
            return dizi;
        }

    },
    BilgiNotu: function (baslik, mesaj, type) {
        /// <summary>Ekranın sağ üst köşesinde mesaj verir bisüre sonra kaybolur.</summary>
        /// <param name="baslik" type="String">Mesaj başlığı string olarak girilir.</param>
        /// <param name="mesaj" type="String">Mesaj metni string olarak girilir.</param>
        /// <param name="type" type="String">[alert|information|error|warning|notification|success] bunlardan biri.</param>
        var n = noty({
            text: mesaj,
            type: type ? type : 'alert',
            dismissQueue: true,
            layout: 'topRight',
            theme: 'defaultTheme',
            timeout: 8000,
            maxVisible: 10
        });
    }
}

WebMethod = {
    Calistir: function (Adres, MethodAdi, GidecekVeri, GelecekIcerikTipi) {
        /// <summary>Web Method kullanımını kolaylaştırır.</summary>
        /// <param name="Adres" type="String">WebMethodun bulunduğu sayfanın adresi.</param>
        /// <param name="MethodAdi" type="String">Webmethodun adı.</param>
        /// <param name="GidecekVeri" type="Array">JSON.stringify ile değer verilir.</param>
        /// <returns type="Ajax">Ajax nesnesinin özelliklerini verir.</returns>
        return $.ajax({
            contentType: GelecekIcerikTipi != null ? GelecekIcerikTipi : 'application/json; charset=utf-8',
            type: "POST", cache: false, dataType: "json",
            url: Adres + "/" + MethodAdi,
            data: GidecekVeri,
            beforeSend: function( xhr ) {
                xhr.overrideMimeType("application/x-www-form-urlencoded; charset=UTF-8");
            },
            error: function (e) {
                console.log("WebMethod.Calistir Hatası: " + JSON.stringify(e));
            }
        });
    }/*Calistir End;*/
} /*WebMethod End; */

DialogForm = {
    Component: null,
    Olustur: function (Id, Caption, Content, Target) {
        /// <summary>İstenilen hedefe div oluşturur ve dialog özelliği kazandırır.</summary>
        /// <param name="Id" type="String">Dialog div id, başında '#' olmadan string ifade yazılır.</param>
        /// <param name="Caption" type="String">Dialog formun başlık alanına string ifade girilir</param>
        /// <param name="Content" type="String">Dialog formun içeriği, #[id] yada string ifade girilebilir.</param>
        /// <param name="Target" type="String">Hedef nesne id, başında '#' ile yazılır.</param>
        /// <returns type="Element">Dialog form oluşur ve $.dialog() özelliklerinin tamamı kullanılır.</returns>
        try {
            
            //dialog div
            this.Component =
                $('<div class="dialog" ' +
                'id="#' + Id +
                '" title="' + Caption +
                '"><div id="DialogFormContent"></div></div>');

            //dialog form projeye ekleniyor.
            if (Target.indexOf("#", 0) === 0) {
                this.Component.appendTo(Target);
            } else {
                console.log("Hedef nesne id, başında '#' ile yazılır.");
            }

            //dialog formun içeriği yükleniyor.
            if (Content.indexOf("#", 0)===0) {
                $(Content).appendTo('#DialogFormContent').show();
            } else {
                $('#DialogFormContent').html(Content);
            }

            //dialog özellikleri ayarlanıyor.
            this.Component.dialog({
                autoResize: true,
                autoOpen: false,
                modal: this.Modal ?this.Modal : false,
                resizable: false,
                width: 'auto',
                beforeClose: function (event, ui) {
                    $('div.FormDogrula').remove();
                }
            });

            return this.Component;

        } catch (e) {
            console.log(e.message);
        }
    }//Olustur end;

}//DialogForm end.

//textbox ya da input'ta sadece rakam girebilmek.
function onlyNumber(e) {
    var keyCode = event.keyCode;
    if ((keyCode < 46 || keyCode > 57) && keyCode != 8 && keyCode != 9 && keyCode != 0 && keyCode != 47 && (keyCode < 96 || keyCode > 105)) {
        return false;
    }
}//onlyNumber end.

(function ($) {
    $.fn.blink = function (options) {
        var defaults = {
            delay: 500
        };
        var options = $.extend(defaults, options);

        return this.each(function () {
            var obj = $(this);
            setInterval(function () {
                if ($(obj).css("visibility") == "visible") {
                    $(obj).css('visibility', 'hidden');
                }
                else {
                    $(obj).css('visibility', 'visible');
                }
            }, options.delay);
        });
    }
}(jQuery))