//
//  SceneDelegate.swift
//  NaviChoice
//
//  Created by Jacob Ridgwell on 9/23/21.
//

import UIKit
import SwiftUI

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = UIHostingController(rootView: LandingView())
        self.window = window
        window.makeKeyAndVisible()
    }

}
