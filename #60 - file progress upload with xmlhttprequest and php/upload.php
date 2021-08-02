<?php

if (isset($_FILES['images'])) {


    for ($i = 0; $i < count($_FILES['images']['name']); $i++) {

        $extension = pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION);
        $new_name = uniqid() . '-' . $_FILES['images']['name'][$i];

        move_uploaded_file($_FILES['images']['tmp_name'][$i], 'images/' . $new_name);
    }

    echo '<pre>' . print_r($_FILES, 1) . '</pre>';
}