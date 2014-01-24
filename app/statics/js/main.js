$(document).ready(function() {
    var eol = String.fromCharCode(13);

    var buttonFormatQuery = $('#format-query');
    var buttonRun = $('#run-query');
    var buttonDebug = $('#show-debug-result');

    buttonFormatQuery.parents('form').on('submit', function(e) {
        e.preventDefault();

        if (true === confirmFormatQuery()) {
            var rawQueryNode = $(this).find('#raw-query');
            var rawQuery = rawQueryNode.val();

            var queryResult = '' + rawQuery;

            queryResult = jQuery.trim(queryResult);
            queryResult = decodeURIComponent(queryResult);
            queryResult = queryResult.replace(/&version=2/, '');
            queryResult = queryResult.replace(/&wt=javabin/, '');
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

    buttonRun.parents('form').on('submit', function(e) {
        e.preventDefault();

        var userClickedButton = $(e.originalEvent.explicitOriginalTarget);

        var url = null;
        url = getQueryUrl(false);
        runQuery(url);
    });

    buttonDebug.on('click', function(e) {
        e.preventDefault();
        url = getQueryUrl(true);
        showQueryDebug(url);
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
        getDebugInfosQuery(queryUrl, function(explains) {
            var debugResultNode = $('#debug-result');
            var debugRowIdPrefix = 'debug-row-';

            // Clean old content
            debugResultNode.children().remove();

            // Index
            var indexContainerNode = $('<div></div>');
            indexContainerNode.addClass('pure-menu');
            indexContainerNode.addClass('pure-menu-open');
            var listIndexNode = $('<ol></ol>');
            jQuery.each(explains, function(key) {
                var listIndexItemNode = $('<li></li>');
                var listIndexLinkNode = $('<a></a>');
                listIndexLinkNode.attr('href', '#' + debugRowIdPrefix + key);
                listIndexLinkNode.text(key);

                listIndexItemNode.append(listIndexLinkNode);
                listIndexNode.append(listIndexItemNode);
            });
            indexContainerNode.append(listIndexNode);
            debugResultNode.append(indexContainerNode);

            $(document).scrollspy({
                min: indexContainerNode.offset().top - parseInt(indexContainerNode.css("margin-top").replace("px", "")),
                max: Number.MAX_VALUE,
                onEnter: function(element, position) {
                    indexContainerNode.toggleClass('sticky', true);
                },
                onLeave: function(element, position) {
                    indexContainerNode.toggleClass('sticky', false);
                }
            });


            // Debug content
            jQuery.each(explains, function(key) {
                var oneRowTitleNode = $('<h3>&nbsp;</h3>');
                oneRowTitleNode.attr('id', debugRowIdPrefix + key);
                oneRowTitleNode.text(key);

                var oneRowDebugNode = $('<pre>&nbsp;<pre>');
                oneRowDebugNode.addClass('pure-u-1');
                var oneRowdebugContent = jQuery.trim(this);
                oneRowdebugContent = oneRowdebugContent.toString().replace(/^(\s*)(\S*)(\s)/gm, '$1<span class="score">$2</span>$3');
                oneRowdebugContent = oneRowdebugContent.toString().replace(/(\w+):("+)([\w\s]+)("+)/gm, '<span class="fieldName">$1</span>:$2<span class="fieldValue">$3</span>$4');
                oneRowdebugContent = oneRowdebugContent.toString().replace(/\((\w+):/gm, '(<span class="fieldName">$1</span>:');
                oneRowdebugContent = oneRowdebugContent.toString().replace(/field=(\w+),/gm, 'field=<span class="fieldName">$1</span>,');
                oneRowDebugNode.html(oneRowdebugContent);

                debugResultNode.append(oneRowTitleNode);
                debugResultNode.append(oneRowDebugNode);
            });
        });
    }

    function getDebugInfosQuery(queryUrl, callback) {
        console.info(queryUrl);
        $.ajax({
            url: 'proxy.php',
            data: {
                url: queryUrl
            },
            success: function(data) {
                var debug = data.debug;
                var explains = debug.explain || {};

                callback.call(this, explains);
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