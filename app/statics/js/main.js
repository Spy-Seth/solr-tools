$(document).ready(function() {
    var eol = String.fromCharCode(13);

    $('#format-query').parents('form').on('submit', function(e) {
        e.preventDefault();

        if (true === confirmFormatQuery()) {
            var rawQueryNode = $(this).find('#raw-query');
            var rawQuery = rawQueryNode.val();

            var queryResult = '' + rawQuery;

            queryResult = jQuery.trim(queryResult);
            queryResult = decodeURIComponent(queryResult);
            queryResult = queryResult.replace(/&version=2/, '');
            queryResult = queryResult.replace(/&wt=\w*/, '');
            queryResult = queryResult.replace(/\?/, eol + '?');
            queryResult = queryResult.replace(/&/g, eol + '&');
            queryResult = queryResult.replace(/\\n/g, eol);

            queryResult = queryResult.replace(/(https?:\/\/(.*):\d{4})/, '');

            if (0 === queryResult.indexOf('/')) {
                queryResult = '/' + queryResult.substr(1, queryResult.length);
            }

            $('#query-editor').val(queryResult);
            $('#original-query-editor').val(queryResult);
        }
    });

    $('#run-query').parents('form').on('submit', function(e) {
        e.preventDefault();

        var userClickedButton = $(e.originalEvent.explicitOriginalTarget);
        var buttonRun = $('#run-query');
        var buttonDebug = $('#get-query-debug-info');

        var url = null;
//                    if (userClickedButton.is(buttonDebug)) {
//                        url = getQueryUrl(true);
//                        showQueryDebug(url);
//                    } else {
        url = getQueryUrl(false);
        runQuery(url);
//                    }


    });

    function getQueryUrl(forceDebug) {
        var host = $('#server-host').val();
        var port = $('#server-port').val();
        var url = jQuery.trim($('#query-editor').val());
        var debug = $('#debug-query').prop('checked');
        var format = $('#result-format').val();

        url += '&wt=' + format;

        if (debug || forceDebug) {
            url += '&debugQuery=true';
            url += '&indent=true';
        }

        if (0 === url.indexOf('/')) {
            url = url.substring(1, url.length);
        }

        url = url.replace(/\n/g, '');

        var finalUrl = 'http://' + host + ':' + port + '/' + url;

        return finalUrl;
    }

    function runQuery(url) {
        window.open(url);
    }

    function showQueryDebug(queryUrl) {
        getDebugInfosQuery(queryUrl);
    }

    function getDebugInfosQuery(queryUrl) {
        $.ajax({
            url: queryUrl,
            success: function(data) {
                var debugInfoNode = $('#debug-info');

                var explains = data.debug.explain;
                console.log(explains);
            }
        })
    }

    /**
     *
     * @returns {Boolean}
     */
    function isQueryHasChangeInEditor() {
        return ($('#original-query-editor').val() != $('#query-editor').val());
    }

    /**
     *
     * @returns {String}
     */
    var confirmLeavePage = function() {
        if (isQueryHasChangeInEditor()) {
            return 'Vous allez perdre les modifications apportées à la requ&ecirc;te. Continuer ?';
        }
    };

    var confirmFormatQuery = function() {
        if (isQueryHasChangeInEditor()) {
            return confirm('Vous allez perdre les modifications apportées à la requ&ecirc;te. Continuer ?');
        }

        return true;
    };

    $(window).on('beforeunload', confirmLeavePage);
});