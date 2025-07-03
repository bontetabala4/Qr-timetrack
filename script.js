
        // Tab switching functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Tab switching
            const tabs = ['scan', 'generate', 'history', 'admin'];
            tabs.forEach(tab => {
                const tabBtn = document.getElementById(`${tab}-tab`);
                const tabContent = document.getElementById(`${tab}-content`);
                
                tabBtn.addEventListener('click', () => {
                    // Hide all tabs
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    
                    // Remove active class from all tab buttons
                    document.querySelectorAll('[id$="-tab"]').forEach(btn => {
                        btn.classList.remove('text-blue-600', 'border-blue-600');
                        btn.classList.add('text-gray-500');
                    });
                    
                    // Show selected tab and mark button as active
                    tabContent.classList.remove('hidden');
                    tabBtn.classList.remove('text-gray-500');
                    tabBtn.classList.add('text-blue-600', 'border-blue-600');
                    
                    // Trigger specific tab actions
                    if (tab === 'scan') {
                        // Maybe stop scanner if it's running from another tab
                        stopScanner();
                    }
                });
            });
            
            // QR Code Generation
            const generateBtn = document.getElementById('generate-btn');
            const employeeIdInput = document.getElementById('employee-id');
            const qrcodeElement = document.getElementById('qrcode');
            
            generateBtn.addEventListener('click', function() {
                const employeeId = employeeIdInput.value.trim();
                if (!employeeId) {
                    showModal('Erreur', 'Veuillez entrer un identifiant valide');
                    return;
                }
                
                // Clear previous QR code
                qrcodeElement.innerHTML = '';
                
                // Generate new QR code
                QRCode.toCanvas(qrcodeElement, employeeId, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                }, function(error) {
                    if (error) {
                        showModal('Erreur', 'Une erreur est survenue lors de la génération du QR Code');
                        console.error(error);
                    }
                });
            });
            
            // QR Code Scanner
            const startScanBtn = document.getElementById('start-scan');
            const stopScanBtn = document.getElementById('stop-scan');
            const scanResult = document.getElementById('scan-result');
            const videoElement = document.getElementById('scanner-video');
            let scannerStream = null;
            
            startScanBtn.addEventListener('click', startScanner);
            stopScanBtn.addEventListener('click', stopScanner);
            
            function startScanner() {
                // Request camera access
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                    .then(function(stream) {
                        scannerStream = stream;
                        videoElement.srcObject = stream;
                        videoElement.play();
                        
                        // Start scanning for QR codes
                        scanQRCode();
                    })
                    .catch(function(err) {
                        console.error("Erreur d'accès à la caméra:", err);
                        showModal('Erreur', "Impossible d'accéder à la caméra. Vérifiez les permissions.");
                    });
            }
            
            function stopScanner() {
                if (scannerStream) {
                    scannerStream.getTracks().forEach(track => track.stop());
                    scannerStream = null;
                    videoElement.srcObject = null;
                }
                
                scanResult.classList.add('hidden');
            }
            
            function scanQRCode() {
                const canvasElement = document.createElement('canvas');
                const canvas = canvasElement.getContext('2d');
                
                function tick() {
                    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                        canvasElement.height = videoElement.videoHeight;
                        canvasElement.width = videoElement.videoWidth;
                        canvas.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                        
                        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: 'dontInvert',
                        });
                        
                        if (code) {
                            // QR code detected
                            scanResult.textContent = `Employé détecté: ${code.data}`;
                            scanResult.classList.remove('hidden');
                            
                            // Simulate sending data to server
                            setTimeout(() => {
                                const now = new Date();
                                document.getElementById('last-checkin').innerHTML = `
                                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p class="text-green-800 font-medium">Pointage enregistré avec succès</p>
                                        <p class="text-gray-600 mt-1">${now.toLocaleDateString()} à ${now.toLocaleTimeString()}</p>
                                    </div>
                                `;
                                
                                // Add to history table (simulated)
                                addCheckinToHistory(now);
                            }, 1000);
                            
                            // Stop scanner after detection
                            stopScanner();
                            return;
                        }
                    }
                    
                    // Continue scanning
                    requestAnimationFrame(tick);
                }
                
                tick();
            }
            
            // History functionality
            function addCheckinToHistory(date) {
                const historyBody = document.getElementById('history-table-body');
                
                // If the placeholder is still there, remove it
                if (historyBody.rows.length === 1 && historyBody.rows[0].cells[0].colSpan === 5) {
                    historyBody.innerHTML = '';
                }
                
                // Add new row
                const row = historyBody.insertRow();
                
                const dateCell = row.insertCell(0);
                const checkinCell = row.insertCell(1);
                const checkoutCell = row.insertCell(2);
                const durationCell = row.insertCell(3);
                const statusCell = row.insertCell(4);
                
                dateCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
                checkinCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                checkoutCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                durationCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                statusCell.className = 'px-6 py-4 whitespace-nowrap text-sm';
                
                dateCell.textContent = date.toLocaleDateString();
                checkinCell.textContent = date.toLocaleTimeString();
                checkoutCell.textContent = '--:--';
                durationCell.textContent = '--:--';
                
                const statusSpan = document.createElement('span');
                statusSpan.className = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
                statusSpan.textContent = 'Présent';
                statusCell.appendChild(statusSpan);
                
                // Update pagination info
                document.getElementById('history-start').textContent = 1;
                document.getElementById('history-end').textContent = historyBody.rows.length;
                document.getElementById('history-total').textContent = historyBody.rows.length;
                
                // Enable pagination buttons if needed
                if (historyBody.rows.length > 5) {
                    document.getElementById('prev-page').disabled = false;
                    document.getElementById('next-page').disabled = false;
                }
            }
            
            // Modal functionality
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modal-title');
            const modalContent = document.getElementById('modal-content');
            const modalCancel = document.getElementById('modal-cancel');
            const modalConfirm = document.getElementById('modal-confirm');
            
            function showModal(title, content) {
                modalTitle.textContent = title;
                modalContent.textContent = content;
                modal.classList.remove('hidden');
            }
            
            function hideModal() {
                modal.classList.add('hidden');
            }
            
            modalCancel.addEventListener('click', hideModal);
            modalConfirm.addEventListener('click', function() {
                // Here you would handle the confirmation action
                hideModal();
            });
            
            // Simulate loading admin data
            setTimeout(() => {
                const adminBody = document.getElementById('admin-table-body');
                adminBody.innerHTML = `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP001</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jean Dupont</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IT</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Actif</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-blue-600 hover:text-blue-900 mr-3">Modifier</button>
                            <button class="text-red-600 hover:text-red-900">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP002</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marie Martin</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RH</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Actif</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-blue-600 hover:text-blue-900 mr-3">Modifier</button>
                            <button class="text-red-600 hover:text-red-900">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP003</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pierre Lambert</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marketing</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En congé</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-blue-600 hover:text-blue-900 mr-3">Modifier</button>
                            <button class="text-red-600 hover:text-red-900">Supprimer</button>
                        </td>
                    </tr>
                `;
            }, 1500);
        });