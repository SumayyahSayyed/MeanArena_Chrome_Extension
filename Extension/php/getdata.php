<?php
require_once __DIR__ . '/../../vendor/autoload.php';
header('Content-Type: application/json');

$entityBody = file_get_contents('php://input');
$data = json_decode($entityBody);

$email = $data -> myemail;
$word = $data -> myword;
$definition = $data -> mymeaning;
$dictionary = $data -> mydictionary;


echo($email);
echo($word);
echo($definition);
echo($dictionary);

    // echo($entityBody);

    $result = array('success' => true, 'message' => 'Data processed successfully' 
    //, 'email' => $email,
    // 'entity' => $entityBody
    );
    echo json_encode($result);

$manager = new MongoDB\Driver\Manager('mongodb+srv://SamSayyed:mySampassword123@mydatabasecluster.ib0uvs4.mongodb.net/');
$accounts_db = new MongoDB\Database($manager, 'Accounts');
$users_collection = $accounts_db->selectCollection('Users');
$user_document = $users_collection->findOne(['email' => $email]);
    
if (!$user_document) {
    echo 'User not found';
} else {
    $user_email = $user_document['email'];
    $collection_name = $user_email . '_words';
    
    // Check if the collection exists for the given email
    $existing_collections = iterator_to_array($accounts_db->listCollections(['name' => $collection_name]));
    if (!empty($existing_collections)) {
        $user_collection = $accounts_db->selectCollection($collection_name);
    } else {
        $accounts_db->createCollection($collection_name);
        $user_collection = $accounts_db->selectCollection($collection_name);
    }
    
    $existing_document = $user_collection->findOne([
        'Word' => $word,
        // 'Definition' => $definition
    ]);
    
    if (!$existing_document) {
        $insert_result = $user_collection->insertOne([
            'Word' => $word,
            'Definition' => $definition,
            'Dictionary' => $dictionary
        ]);
        
        echo 'Inserted document with ID: ' . $insert_result->getInsertedId();
    } else {
        echo 'The document already exists';
    }
}    


    unset($manager);
?>