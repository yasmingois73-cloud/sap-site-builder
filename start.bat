@echo off
start "Frontend" cmd /k "cd C:\Users\paulomatos\Documents\GitHub\sap-site-builder && npm run dev"
start "Backend" cmd /k "cd C:\Users\paulomatos\Documents\GitHub\operacao-diaria2-backend && python manage.py runserver"

:: Abrir o navegador padrao com a URL do frontend
start "msedge" "http://localhost:3000"