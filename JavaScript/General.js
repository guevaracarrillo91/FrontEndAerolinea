var General = {
    delete: function (url, data, callback, type) {

        if ($.isFunction(data)) {
            type = type || callback,
                callback = data,
                data = {}
        }

        return $.ajax({
            url: url,
            type: 'DELETE',
            success: callback,
            data: data,
            contentType: type
        });
    },
    put: function (url, data, callback, type) {

        if ($.isFunction(data)) {
            type = type || callback,
                callback = data,
                data = {}
        }

        return $.ajax({
            url: url,
            type: 'PUT',
            contentType:"application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: callback
        });
    },

    post:function(url, data, callback) {
        if ( $.isFunction( data ) ) {
            callback = data;
            data = undefined;
        }
    
        return jQuery.ajax({
            url: url,
            type: "POST",
            contentType:"application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: callback
        });
    }
};