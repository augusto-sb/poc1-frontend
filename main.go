package main

import(
    "io/fs"
    "io/ioutil"
    "net/http"
    "os"
    "path/filepath"
    "strings"
)

const dir string = "./build";
var contextPath string;

func handleError(err error){
    if err != nil {
        panic(err);
    }
}

func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        //      server.Handle("/lvlone/", http.StripPrefix("/lvlone/", os))
        w.Header().Set("Cache-Control", "max-age=86400, public") // 24hs=86400segs
        if(strings.HasPrefix(r.URL.Path, contextPath)){
            r.URL.Path = strings.CutPrefix(r.URL.Path, contextPath)
        }
        _, err := os.Stat(dir+r.URL.Path)
        if(err != nil){
            r.URL.Path = "/";
        }
        next.ServeHTTP(w, r)
    })
}

func standarizedContextPath() string {
    t := os.Getenv("CONTEXT_PATH");
    restul := ""
    parts := strings.Split(t, "/")
    for _, p := range parts {
        if(p == ""){
            continue;
        }
        restul += "/"+p;
    }
    return restul;
}

func main()(){
    contextPath = standarizedContextPath()
    var err error;
    var fileServer http.Handler;
    err = filepath.Walk(dir, func(path string, info fs.FileInfo, err2 error) error {
        var err3 error;
        var input []byte;
        var output string;
        handleError(err2);
        if(!info.IsDir()){
            input, err3 = ioutil.ReadFile(path);
            handleError(err3);
            output = strings.Replace(string(input), "/context/path", contextPath, -1);
            //reemplazar environment.ts values...
            err3 = ioutil.WriteFile(path, []byte(output), 0777)
            handleError(err3);
        }
        return nil;
    })
    handleError(err);
    fileServer = http.FileServer(http.Dir(dir))
    http.Handle("/", middleware(fileServer)); // ACA SI manejamos el rewrite de nuestro lado, devolver not found o redirijir a index?
    err = http.ListenAndServe(":8080", nil);
    handleError(err);
}