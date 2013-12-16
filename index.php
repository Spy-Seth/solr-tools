<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Solr tools</title>

        <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.3.0/pure-min.css">
        <style>
            body {
                padding: 0 2em;
            }

            #raw-query {
                height: 100px;
            }
            #query-editor {
                height: 400px;
            }
            #original-query-editor {
                display: none;
            }

            /* bug pure */
            legend {
                letter-spacing: 0em;
            }

            #result-preview {
                width: 100%;
                height: 600px;
                border: 0;
            }
        </style>
    </head>
    <body>
        <div class="pure-g-r">
            <div class="pure-u-1">
                <form action="" method="GET" class="pure-form pure-g-r">
                    <fieldset class="pure-group">
                        <legend>Solr query formatter</legend>
                        <div class="pure-u-1"><textarea name="raw-query" id="raw-query" class="pure-input-1" placeholder="Veuillez saisir la requ&ecirc;te &aacute; formater..." required autofocus><?php echo $rawQuery; ?></textarea></div>

                        <div class="pure-u-1"><button type="submit" id="format-query" class="pure-button pure-input-1">format</button></div>
                    </fieldset>
                </form>

                <form action="" method="GET" class="pure-form pure-g-r">
                    <fieldset class="pure-group">
                        <legend>Query editor</legend>

                        <div class="pure-g">
                            <div class="pure-u-1-5">
                                <select id="server-host" class="pure-input-1">
                                    <option value="velo1solx01.virtual-expo.com">velo1solx01.virtual-expo.com</option>
                                    <option value="velo1solx02.virtual-expo.com" selected>velo1solx02.virtual-expo.com</option>
                                    <option value="veso2solx01.virtual-expo.com">veso2solx01.virtual-expo.com</option>
                                    <option value="veso3solx03.virtual-expo.com">veso3solx03.virtual-expo.com</option>
                                    <option value="veso3solx04.virtual-expo.com">veso3solx04.virtual-expo.com</option>
                                </select>
                            </div>

                            <div class="pure-u-1-8">
                                <select id="server-port" class="pure-input-1">
                                    <option value="8080">8080 - AE</option>
                                    <option value="8081" selected>8081 - NE</option>
                                    <option value="8082">8082 - DI</option>
                                    <option value="8083">8083 - ME</option>
                                </select>
                            </div>

                            <div class="pure-u-1-8">
                                <select id="result-format" class="pure-input-1">
                                    <option value="xml">xml</option>
                                    <option value="json" selected>json</option>
                                </select>
                            </div>

                            <div class="pure-u-1-4">
                                <label for="debug-query" class="pure-checkbox">
                                    <input type="checkbox" id="debug-query" checked>
                                    debug
                                </label>
                            </div>
                        </div>

                        <div class="pure-u-1">
                            <textarea name="query-editor" id="query-editor" class="pure-input-1" required></textarea>
                            <textarea name="original-query-editor" id="original-query-editor"></textarea>
                        </div>

                        <div class="pure-u-1"><button type="submit" id="run-query" class="pure-button pure-input-1 pure-button-primary">run</button></div>
                    </fieldset>
                </form>
            </div>
        </div>



        <script src="http://code.jquery.com/jquery-2.0.3.js"></script>
        <script type="text/javascript">
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
                        queryResult = queryResult.replace(/&wt=javabin/, '');
                        queryResult = queryResult.replace(/select\/\?/, 'select/' + eol + '?');
                        queryResult = queryResult.replace(/select\?/, 'select/' + eol + '?');
                        queryResult = queryResult.replace(/&/g, eol + '&');

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

                    var host = $('#server-host').val();
                    var port = $('#server-port').val();
                    var url = jQuery.trim($('#query-editor').val());
                    var debug = $('#debug-query').prop('checked');
                    var format = $('#format-result').val();

                    url += '&wt=' + format;

                    if (debug) {
                        url += '&debugQuery=true';
                    }

                    if (0 === url.indexOf('/')) {
                        url = url.substring(1, url.length);
                    }

                    url = url.replace(/\n/g, '');

                    var tmpUrl = 'http://' + host + ':' + port + '/' + url;
                    var finalUrl = decodeURI(tmpUrl);

                    window.open(finalUrl);
                });

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
        </script>
    </body>
</html>
