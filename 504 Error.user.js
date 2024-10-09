// ==UserScript==
// @name         504 Error
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Reload page if an error occurs with a customizable delay (saved in localStorage)
// @author       You
// @match        https://algeria.blsspainglobal.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const LOCAL_STORAGE_KEY = 'reloadDelay'; // Clé utilisée pour sauvegarder le délai dans localStorage

    // Fonction pour sauvegarder le délai dans localStorage
    function saveDelayToLocalStorage(delay) {
        localStorage.setItem(LOCAL_STORAGE_KEY, delay);
    }

    // Fonction pour récupérer le délai depuis localStorage
    function getDelayFromLocalStorage() {
        const savedDelay = localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedDelay ? parseInt(savedDelay, 10) : 1; // Retourne 1 par défaut si aucun délai n'est sauvegardé
    }

    // Fonction principale pour vérifier le titre de la page et recharger si une erreur est détectée
    function reloadPageIfError() {
        const errorTitles = [
            "Application Temporarily Unavailable",
            "504 Gateway Time-out",
            "502 Bad Gateway",
            "503 Service Temporarily Unavailable",
            "Service Unavailable",
            "500 Internal Server Error",
            "Database error",
            "FastCGI Error",
            "The connection has timed out",
            "Problemas al cargar la página",
            "Error 502 (Server Error)!!1",
            "403 Forbidden",
            "Service Unavailable','403 ERROR",
            "502 Bad Gateway"
        ];

        const pageTitle = document.title;

        if (errorTitles.includes(pageTitle)) {
            // Récupère la valeur du délai depuis le champ ou localStorage
            const reloadDelayInput = document.getElementById("reloadDelay");
            let delayInSeconds = parseInt(reloadDelayInput.value, 10);

            // Si la valeur est invalide ou inférieure à 1, définir un délai par défaut de 1 seconde
            if (isNaN(delayInSeconds) || delayInSeconds < 1) {
                delayInSeconds = 1;
            }

            // Sauvegarder le délai dans localStorage
            saveDelayToLocalStorage(delayInSeconds);

            // Recharger la page après le délai spécifié
            setTimeout(function () {
                window.location.reload();
            }, delayInSeconds * 1000); // Convertir en millisecondes
        }
    }

    // Créer et ajouter le champ de saisie à droite de la page
    function createReloadDelayInput() {
        const savedDelay = getDelayFromLocalStorage(); // Récupérer le délai sauvegardé

        const reloadDelayContainer = document.createElement('div');
        reloadDelayContainer.id = "reloadDelayContainer";
        reloadDelayContainer.style.position = "fixed";
        reloadDelayContainer.style.top = "250px";
        reloadDelayContainer.style.right = "20px";
        reloadDelayContainer.style.padding = "3px";
        reloadDelayContainer.style.backgroundColor = "#f0f0f0";
        reloadDelayContainer.style.border = "1px solid #ccc";
        reloadDelayContainer.style.borderRadius = "1px";
        reloadDelayContainer.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
        reloadDelayContainer.innerHTML = `
            <label for="reloadDelay" style="font-weight:bold;">504 ERROR :</label>
            <input type="number" id="reloadDelay" value="${savedDelay}" min="1" style="margin-top:5px; padding:3px; width:60px; font-size:12px;">
        `;
        document.body.appendChild(reloadDelayContainer);

        // Ajouter un écouteur d'événement pour sauvegarder la nouvelle valeur dès que l'utilisateur la change
        const reloadDelayInput = document.getElementById("reloadDelay");
        reloadDelayInput.addEventListener('input', function () {
            const newDelay = parseInt(reloadDelayInput.value, 10);
            if (!isNaN(newDelay) && newDelay > 0) {
                saveDelayToLocalStorage(newDelay);
            }
        });
    }

    // Exécuter les fonctions
    createReloadDelayInput();  // Créer le champ de saisie
    reloadPageIfError();       // Vérifier et recharger si erreur
})();
