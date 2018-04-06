<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Send return header information
//header("Content-Type: application/json; charset=UTF-8");
//
// HTTP method implementation

$harr = [];
switch ($method) {
    case "GET":
        $diary = $_GET['diary'];
        //console_log(count($diary));
        for ($j = count($diary)-1; $j >= 0; $j--) {
            $event = $diary[$j];
            /*
            $event_arr['Title'] = $event['summary'];
            $event_arr['Description'] = $event['description'];
            $event_arr['Date'] = substr($event['start']['dateTime'], 0, 10);
             */

            $event_arr['Title'] = $event['Title'];
            $info = json_decode(getMovie($event['Title']));
            $i = 0;
            for (; $i < $info->total_results; $i++) {
                if (strcasecmp($info->results[$i]->title, $event['Title']) == 0) {
                    break;
                }
            }
            if ($i < $info->total_results) {
                $event_arr['Details'] = 1;
                $event_arr['Score'] = $info->results[$i]->vote_average;
                $event_arr['Poster'] = $info->results[$i]->poster_path;
                $event_arr['Overview'] = $info->results[$i]->overview;
                $event_arr['Release'] = $info->results[$i]->release_date;
            } else {
                $event_arr['Details'] = 0;
            }
            array_push($harr, $event_arr);
        }
        break;
    case "PUT":
        break;
    case "POST":
        break;
    case "DELETE":
        break;
    case "PATCH":
        break;
}
//console_log(count($harr));
echo json_encode($harr);

function getMovie($title) {
    $keyT = "9bcba429f40b104a310128f38266f99c";
    $urlT = "https://api.themoviedb.org/3/search/movie?api_key=" . $keyT . "&language=en-US&query=";
    $words = explode(" ", $title);
    $url = $urlT . $words[0];
    for ($i = 1; $i < count($words); $i++) {
        $url = $url . "%20" . $words[$i];
    }
    $url = $url . "&page=1";
    $details = file_get_contents($url);
    return $details;
}

function console_log($data) {
    if (is_array($data) || is_object($data)) {
        echo("<script>console.log('" . json_encode($data) . "');</script>");
    } else {
        echo("<script>console.log('" . $data . "');</script>");
    }
}

?>