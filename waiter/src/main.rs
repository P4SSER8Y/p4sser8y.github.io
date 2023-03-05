mod how_time_flies;

use rocket;
use rocket::serde::json::Json;
use serde::Serialize;

#[derive(Serialize)]
struct Ack<T> {
    ok: bool,
    data: T,
}

#[rocket::catch(default)]
fn any_error(_req: &rocket::Request) -> Json<Ack<&'static str>> {
    Json(Ack {
        ok: false,
        data: "wtf",
    })
}

#[rocket::launch]
fn launcher() -> _ {
    use dotenv;
    dotenv::dotenv().ok();

    use how_time_flies;
    let body = rocket::build();
    let body = how_time_flies::build("/htf", body);
    let body = body.register("/", rocket::catchers![any_error]);
    let body = body.mount( "/", rocket::fs::FileServer::from(std::env::var("WAITER_STATIC_PATH").unwrap_or("static".to_string())));
    body
}
