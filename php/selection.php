<?php
require_once __DIR__ . '/../../vendor/autoload.php';
header('Content-Type: application/json');
$entityBody = file_get_contents('php://input');
$data = json_decode($entityBody);
// echo($entityBody);

$email = $data->userEmail;
// echo($email);

$manager = new MongoDB\Driver\Manager('mongodb+srv://SamSayyed:mySampassword123@mydatabasecluster.ib0uvs4.mongodb.net/');
$accounts_db = new MongoDB\Database($manager, 'Accounts');
$user_words_collection = $accounts_db->selectCollection($email . '_words');

$saved_words = array();
$saved_def = array();
$cursor = $user_words_collection->find();
foreach ($cursor as $document) {
    $saved_words[] = $document['Word'];
    $saved_def[] = $document['Definition'];
}

// Create an associative array with the userEmail and savedWords values
$response = array(
    'savedWords' => $saved_words,
    'savedDef' => $saved_def
);

// Return the response as a JSON-encoded object
echo json_encode($response);
unset($manager);

?>
