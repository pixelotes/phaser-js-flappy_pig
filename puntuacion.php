<?php          
            
            $host="p:localhost";
            $port=3306;
            $user="root";
            $password="";
            $dbname="pruebas";
            $res=array();
            $pun;
            $nom;
            
            $cxn = new mysqli($host, $user, $password, $dbname, $port)
            or die ('N/A' . mysqli_connect_error());

            $query = "SELECT * FROM puntuacion ORDER BY puntuacion.puntuacion DESC;";
            //$query = "SELECT * FROM puntuacion WHERE fecha = CURDATE() ORDER BY puntuacion.puntuacion DESC";

            if ($cxn->real_query ($query)) {

                    if ($result = $cxn->store_result()) {

                        $nrows = $result->num_rows;

                        $all_rows = $result->fetch_all(MYSQLI_ASSOC);

                        //crea los elementos de la lista a partir de los resultados
                        for($i = 0; $i < count($all_rows); $i++) {
                            $res[$i]=$all_rows[$i]['puntuacion'];
                        }
                    }

                    $result->close(); //liberamos recursos
                }
                
            if(isset($_GET["nom"]) != null && $_GET["pun"] != null && $_GET["sav"]=="Y") {
				$nom = $_GET["nom"];
				$pun = $_GET["pun"];
				
				mysqli_query($cxn,"INSERT INTO puntuacion (usuario, puntuacion, fecha) VALUES ('".$nom."',".$pun.",now())");
			}
			
			if(isset($_GET["pun"])) {
				$pun = $_GET["pun"];
				$norank = true;
					for($i = 0; $i < count($res); $i++) {
						if ($pun>=$res[$i]) {
							echo ($i+1)." de ".count($res);
							$norank = false;
							break;
						}
					}
				if($norank) {
					echo count($res)." de ".count($res);
				}
            }
            
?>