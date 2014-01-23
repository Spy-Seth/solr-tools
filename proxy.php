<?php

require_once './vendor/autoload.php';

$format = 'json';
$url = null;
if (isset($_GET['url']) && !empty($_GET['url'])) {
    $url = urldecode($_GET['url']);
    $url = str_replace('&wt=xml', '&wt=json', $url);
    $url = str_replace('&wt=javabin', '&wt=json', $url);

    $url = str_replace('&indent=true', '&indent=false', $url);
}

$response = Guzzle\Http\StaticClient::post($url);
if ($response->isSuccessful()) {
    if ('json' == $format) {
        header('Content-type: application/json charset=utf-8');
    } else if ('xml' == $format) {
        header('Content-Type: application/xml; charset=utf-8');
    } else {
        header('Content-type: text/plain; charset=utf-8');
    }

    echo $response->getBody(true);
} else {
    echo 'An error occur during the request.';
    echo $response;
}