//
//  WebViewController.swift
//  navichoice
//
//  Created by Zack Moss on 10/13/21.
//

import UIKit
import WebKit

class ViewController: UIViewController {
    private let url = "https://www.navichoice.app/setup";
        

    @IBAction func setupTutorialClicked(_ sender: Any) {
        if let url = URL(string: url) {
            UIApplication.shared.open(url)
        }
    }
}
