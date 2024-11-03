document.getElementById('upload').addEventListener('change', handleImageUpload);
document.getElementById('downloadBtn').addEventListener('click', downloadImage);

function handleImageUpload(event) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvasSize = 320;
            canvas.width = canvasSize;
            canvas.height = canvasSize;

            // Calcular la escala para mantener la proporción de la imagen
            const scale = Math.max(canvasSize / img.width, canvasSize / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            // Calcular el desplazamiento en X para centrar horizontalmente y en Y para recortar solo desde la parte inferior
            const offsetX = (canvasSize - scaledWidth) / 2;
            const offsetY = 0; // Mantiene la parte superior en 0 y recorta desde la parte inferior si es necesario

            // Dibujar la imagen escalada, centrada en X y recortada solo desde la parte inferior si es necesario
            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

            // Superponer una imagen fija en la parte inferior centrada
            const overlayImg = new Image();
            overlayImg.src = 'superposicion.png';
            overlayImg.onload = function() {
                const overlayHeight = canvasSize * 0.2; // Ocupa el 20% de la altura del canvas
                const overlayWidth = (overlayImg.width / overlayImg.height) * overlayHeight;

                // Calcular la posición X para centrar la imagen de superposición
                const xPosition = (canvasSize - overlayWidth) / 2;
                const yPosition = canvasSize - overlayHeight;

                // Dibujar la superposición centrada en la parte inferior de la imagen
                ctx.drawImage(overlayImg, xPosition, yPosition, overlayWidth, overlayHeight);
            };
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function downloadImage() {
    const canvas = document.getElementById('canvas');

    if (canvas.width === 0 || canvas.height === 0) {
        alert("Primero sube una imagen para descargar.");
        return;
    }

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'imagen_con_superposicion.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 'image/png');
}
