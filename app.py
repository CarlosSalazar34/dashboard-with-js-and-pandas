from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

async def main(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

app.add_api_route("/", main, methods=["GET", "POST"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="app:app", host="127.0.0.1", port=8000, reload=True)