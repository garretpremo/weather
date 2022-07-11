use std::fs;
use std::fs::File;
use std::io::Write;

struct Entry {
    zip: String,
    lat: String,
    lng: String
}

/// Program used to generate a usable tsx file from `zip-code-data.csv`
///     csv data obtained from https://gist.github.com/erichurst/7882666
fn main() -> Result<(), std::io::Error> {

    let mut file = File::create("zip-code-data.tsx")?;

    file.write(b"export const zipCodeData: Record<string, {latitude: string, longitude: string}> = {")?;

    let entries: Vec<Entry> = {
        let zip_code_data = fs::read_to_string("./src/zip-code-data.csv").unwrap();

        zip_code_data.trim().split("\r\n")
            .map(|line| {
                let entry: Vec<&str> = line.split(',').collect();

                Entry { zip: entry[0].into(), lat: entry[1].into(), lng: entry[2].trim().into() }
            })
            .collect()
    };

    for (index, entry) in entries.iter().enumerate() {
        let mut json = format!(r#"
    "{}": {{
        "latitude": "{}",
        "longitude": "{}"
    }}"#, entry.zip, entry.lat, entry.lng);

        if index != entries.len() - 1 {
            json += ",";
        }

        file.write(json.as_bytes())?;
    }

    file.write(b"\n};")?;

    Ok(())
}
