//
//  ViewController.swift
//  DemoWebGL
//
//  Created by MC976 on 9/17/16.
//  Copyright © 2016 MC976. All rights reserved.
//

import UIKit
import WebKit
import GCDWebServer

class ViewController: UIViewController {
    
    var webServer = GCDWebUploader()
    var webView = WKWebView(frame: CGRect.zero)
//    var webView = UIWebView(frame: CGRect.zero)

    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        let height = NSLayoutConstraint(item: webView, attribute: .Height, relatedBy: .Equal, toItem: view, attribute: .Height, multiplier: 1, constant: 0)
        let width = NSLayoutConstraint(item: webView, attribute: .Width, relatedBy: .Equal, toItem: view, attribute: .Width, multiplier: 1, constant: 0)
        view.addConstraints([height, width])
//        let urlRequest = NSURLRequest(URL: NSURL(string: "http://media.prod.nissan.eu/MEDIA/special/juke_sv2/index_FR_fr.html")!)
//        let url = NSURL
//        let file = NSBundle.mainBundle().pathForResource("index_FR_fr", ofType: ".html", inDirectory: "nissan/juke_sv2")
        
//        print("Bundle path \(file)")
//        let url = NSURL(fileURLWithPath: file!)
//        let urlRequest = NSURLRequest (URL: url)
//        webView.loadRequest(urlRequest)
        uploadFolderToLocalServer()
        loadWebView()
    }
    
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}

extension ViewController: GCDWebUploaderDelegate {
    func uploadFolderToLocalServer() {
        let file = NSBundle.mainBundle().pathForResource("nissan",ofType: "")
        webServer = GCDWebUploader.init(uploadDirectory: file)
        webServer.delegate = self
        webServer.start()
         print("Visit \(webServer.serverURL) in your web browser")
        print("running locally on port \(webServer.port)")
    }
    
    func loadWebView() {
        let url = NSURL(string: webServer.serverURL.absoluteString + "juke_sv2/index_FR_fr.html")
        let urlRequest = NSURLRequest (URL: url!)
        webView.loadRequest(urlRequest)
    }
    
    func webUploader(uploader: GCDWebUploader!, didCreateDirectoryAtPath path: String!) {
        print("Create \(path)")
    }
}
