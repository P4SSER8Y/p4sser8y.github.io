use log::info;
use once_cell::sync::Lazy;
use regex::{Regex, RegexBuilder};
use rocket::fs::NamedFile;
use rocket::http::Status;
use rocket::response::Responder;
use rocket::tokio::fs::File;
use rocket::{self, routes};
use rocket::{Build, Request, Response, Rocket};
use serde::Serialize;
use std::path::{Path, PathBuf};

pub fn build(base: &'static str, build: Rocket<Build>) -> Rocket<Build> {
    build.mount(
        base,
        routes![
            get_user_record,
            get_asset,
            options_user_record,
            options_asset
        ],
    )
}

#[derive(Serialize)]
struct Ack<T> {
    ok: bool,
    data: T,
}

static DATA_PATH_BASE: Lazy<PathBuf> = Lazy::new(|| {
    let data_path_base = std::env::var("OS_DATA_PATH_BASE").unwrap_or(r"data".to_string());
    info!("OS_DATA_PATH_BASE={}", data_path_base);
    Path::new(&data_path_base).join("stream")
});

fn cors_config(response: &mut Response, request: &Request) {
    static RE_HOST: Lazy<Regex> = Lazy::new(|| {
        let pattern = std::env::var("OS_CORS_DOMAIN_PATTERN").unwrap_or(r".*".to_string());
        info!("OS_CORS_DOMAIN_PATTERN={}", pattern);
        RegexBuilder::new(pattern.as_str())
            .case_insensitive(true)
            .multi_line(false)
            .build()
            .unwrap()
    });
    if let Some(host) = request.host() {
        if RE_HOST.is_match(host.domain().as_str()) {
            response.set_raw_header(
                "Access-Control-Allow-Origin",
                request
                    .headers()
                    .get("Origin")
                    .next()
                    .unwrap_or("null")
                    .to_string(),
            );
            response.set_raw_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.set_raw_header("Access-Control-Allow-Headers", "DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
        }
    }
}

struct CorsResponse;
impl<'r, 'o: 'r> Responder<'r, 'o> for CorsResponse {
    fn respond_to(self, request: &'r Request<'_>) -> rocket::response::Result<'o> {
        let mut response = Status::Ok.respond_to(request)?;
        cors_config(&mut response, &request);
        Ok(response)
    }
}

struct RecordResponse(File);
impl<'r, 'o: 'r> Responder<'r, 'o> for RecordResponse {
    fn respond_to(self, request: &'r Request<'_>) -> rocket::response::Result<'o> {
        let mut response = self.0.respond_to(request)?;
        response.set_raw_header("Content-Type", "text/yml; charset=utf-8");
        response.set_raw_header("Cache-Control", "max-age=3600");
        cors_config(&mut response, &request);
        Ok(response)
    }
}

struct AssetResponse(NamedFile);
impl<'r, 'o: 'r> Responder<'r, 'o> for AssetResponse {
    fn respond_to(self, request: &'r Request<'_>) -> rocket::response::Result<'o> {
        let mut response = self.0.respond_to(request)?;
        response.set_raw_header("Cache-Control", "max-age=31536000,public");
        cors_config(&mut response, &request);
        Ok(response)
    }
}

#[rocket::get("/<user>")]
async fn get_user_record(user: &str) -> Result<RecordResponse, Status> {
    let path = DATA_PATH_BASE.join(user).join("records.yml");
    Ok(RecordResponse(
        File::open(path).await.or(Err(Status::NotFound))?,
    ))
}

#[rocket::options("/<_user>")]
async fn options_user_record(_user: &str) -> CorsResponse {
    CorsResponse
}

#[rocket::get("/<user>/assets/<path>")]
async fn get_asset(user: &str, path: std::path::PathBuf) -> Result<AssetResponse, Status> {
    let path = DATA_PATH_BASE.join(user).join("assets").join(path);
    Ok(AssetResponse(
        NamedFile::open(path).await.or(Err(Status::NotFound))?,
    ))
}

#[rocket::options("/<_user>/assets/<_path>")]
async fn options_asset(_user: &str, _path: &str) -> CorsResponse {
    CorsResponse
}
