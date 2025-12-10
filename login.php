
<?php
if (isset($_POST['prenom']) AND isset($_POST['nom']) AND isset($_POST['login']) AND isset($_POST['password']) AND isset($_POST['passwordagain']) AND isset($_POST['mail'])) // Si les variables existent
{
    if ($_POST['prenom'] != NULL AND $_POST['nom'] != NULL AND $_POST['login'] != NULL AND $_POST['password'] != NULL AND $_POST[           'passwordagain'] != NULL AND $_POST['mail'] != NULL) // Si on a quelque chose à enregistrer
    {
        if ($_POST['password'] == $_POST['passwordagain']) // si les deux passwords saisis sont identiques
        {
        // D'abord, on se connecte à MySQL
 
     
mysql_connect("localhost", "root", "root");
 
        mysql_select_db("test");
 
  
 
        // On utilise les fonctions PHP mysql_real_escape_string et htmlspecialchars pour la sécurité
 
        $prenom = mysql_real_escape_string(htmlspecialchars($_POST['prenom']));
        $nom = mysql_real_escape_string(htmlspecialchars($_POST['nom']));
        $login = mysql_real_escape_string(htmlspecialchars($_POST['login']));
        $password = mysql_real_escape_string(htmlspecialchars($_POST['password']));
        $mail = mysql_real_escape_string(htmlspecialchars($_POST['mail']));
         
        $veriflog = mysql_query("SELECT login FROM login");
        $verifmail = mysql_query("SELECT mail FROM login");
        if ($login == $veriflog)
        {
        echo'L\'identifiant que vous avez choisi existe déjà, merci d\'en choisir un autre';
        }
        else if ($mail == $verifmail)
        {
        echo 'Le mail que vous avez indiqué existe déjà dans la base !';
        }
        // Ensuite on enregistre le message
 
        mysql_query("INSERT INTO login VALUES('', '$prenom', '$nom', '$login', '$password', '$mail')");
         
        // On se déconnecte de MySQL
        mysql_close();
        ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Document sans titre</title>
</head>
<body>
<p>Bravo, <?php echo $_POST['prenom'].' '.$_POST['nom']; ?> vous êtes inscrit sur le site ! </p>
<p>Un mail de confirmation va vous être envoyé.</p>
<p></p>
<form id="identifie" name="identifie" method="post" action="accueil.php">
  <input type="hidden" name="login" id="login" value="<?php echo $_POST['login'];?>" />
  <input type="hidden" name="password" id="password" value="<?php echo $_POST['password'];?>" />
  <input type="hidden" name="prenom" id="prenom" value="<?php echo $_POST['prenom'];?>" />
  <input type="hidden" name="nom" id="nom" value="<?php echo $_POST['nom'];?>" />
  <input type="submit" name="register" id="register" value="Revenir à l'accueil" />
</form>
</body>
</html>
<?php
}
else if ($_POST['password'] != $_POST['passwordagain']) // si les deux passwords saisis sont différents
{
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Document sans titre</title>
</head>
<body>
<form id="inscription" name="inscription" method="post" action="login.php">
  <p>Prénom :
    <input type="text" name="prenom" id="prenom" value="<?php echo $_POST['prenom']; ?>" />
  </p>
  <p>Nom :
    <input type="text" name="nom" id="nom" value="<?php echo $_POST['nom']; ?>" />
  </p>
  <p>Identifiant :
    <input type="text" name="login" id="login" value="<?php echo $_POST['login']; ?>" />
  </p>
  <p style="color:#FF0000">Mot de passe :
    <input type="password" name="password" id="password" maxlength="10" />
  </p>
  <p style="color:#FF0000">Répéter le mot de passe :
    <input type="password" name="passwordagain" id="passwordagain" maxlength="10" />
  </p>
  <p>Adresse mail :
    <input type="text" name="mail" id="mail" value="<?php echo $_POST['mail']; ?>" />
  </p>
  <p>
    <input type="submit" name="register" id="register" value="Enregistrer" />
  </p>
</form>
</body>
</html>
<?php
$error = 'Les deux mots de passe que vous avez saisi ne sont pas identiques,
veuillez recommencer s\'il vous plait.';
$error = nl2br ($error);
echo $error; // on affiche le message d'erreur
}
}
else
{
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Document sans titre</title>
</head>
<body>
<form id="inscription" name="inscription" method="post" action="login.php">
  <p>Prénom :
    <input type="text" name="prenom" id="prenom" value="<?php echo $_POST['prenom']; ?>" />
  </p>
  <p>Nom :
    <input type="text" name="nom" id="nom" value="<?php echo $_POST['nom']; ?>" />
  </p>
  <p>Identifiant :
    <input type="text" name="login" id="login" value="<?php echo $_POST['login']; ?>" />
  </p>
  <p>Mot de passe :
    <input type="password" name="password" id="password" maxlength="10" />
  </p>
  <p>Répéter le mot de passe :
    <input type="password" name="passwordagain" id="passwordagain" maxlength="10" />
  </p>
  <p>Adresse mail :
    <input type="text" name="mail" id="mail" value="<?php echo $_POST['mail']; ?>" />
  </p>
  <p>
    <input type="submit" name="register" id="register" value="Enregistrer" />
  </p>
</form>
</body>
</html>
<?php
echo 'Tous les champs sont obligatoires !';
}
}
?>

