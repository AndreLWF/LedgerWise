.PHONY: backend frontend install

# Start the FastAPI backend (creates venv and installs deps if needed)
backend:
	cd backend && \
	[ -d venv ] || python3 -m venv venv && \
	. venv/bin/activate && \
	pip install -q -r requirements.txt && \
	uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

# Start the Expo frontend
frontend:
	cd frontend && npx expo start

# Install all dependencies (backend venv + frontend node_modules)
install:
	cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install
