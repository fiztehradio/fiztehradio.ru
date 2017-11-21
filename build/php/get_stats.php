<?php
// Connect to MySQL
$link = new mysqli( 'radio.mipt.ru', 'stats-loader', 'give_me_stats_please', 'radio' );
if ( $link->connect_errno ) {
	die( "Failed to connect to MySQL: (" . $link->connect_errno . ") " . $link->connect_error );
}

// Fetch the data
$query = "SELECT * FROM broadcast_statistics_2017 ORDER BY timestamp ASC";
$result = $link->query( $query );

// All good?
if ( !$result ) {
	// Nope
	$message  = 'Invalid query: ' . $link->error . "<br>";
	$message .= 'Whole query: ' . $query;
	die( $message );
}

// Print out rows
//while ( $row = $result->fetch_assoc() ) {
//	echo $row['timestamp'] . ' | ' . $row['websiteListenersNumber'] . ' | ' .$row['youtubeListenersNumber'] . "<br>";
//}

// Close the connection
mysqli_close($link);

// Set proper HTTP response headers
header( 'Content-Type: application/json' );

// Print out rows
$data = array();
while ( $row = $result->fetch_assoc() ) {
	$data[] = $row;
}
echo json_encode( $data );
?>