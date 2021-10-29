//
//  ContentView.swift
//  navichoice
//
//  Created by Jacob Ridgwell on 10/24/21.
//

import SwiftUI

struct ContentView: View {
    private let setupUrl = "https://www.navichoice.app/setup";
    private let githubUrl = "https://github.com/J-Ridgwell/default-google-maps-transform-ios-safari-extension";
    private let privacyPolicyUrl = "https://www.navichoice.app/privacy-policy";

    private let mailtoSupportUrl = URL(string: "mailto:support@navichoice.app?subject=Support".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!)!

    private let mailToFeatureRequestUrl = URL(string: "mailto:feature-request@navichoice.app?subject=Feature Request ".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!)!
    
    var body: some View {
        NavigationView {
            List() {
                Section(header: Text("How to enable"),
                        footer: Button(
                            action: {
                                UIApplication.shared.open(URL(string: setupUrl)!)
                            }) {
                                    Text("Or directly in Safari!")
                                }
                ) {
                    NavigationLink(destination: HowToEnable()) {
                        Text("Enable in Settings")
                    }.navigationTitle("NaviChoice")
                }

                Section(header: Text("About")) {
                    Button(action: {
                            UIApplication.shared.open(URL(string: githubUrl)!)
                        
                    }) {
                        Text("NaviChoice is source-available!")
                        
                    }
                    Button(action: {
                            UIApplication.shared.open(URL(string: privacyPolicyUrl)!)
                        
                    }) {
                        Text("Privacy Policy")
                        
                    }

                }
                
                Section(header: Text("Contact")) {
                    Button(action: {
                                UIApplication.shared.open(mailtoSupportUrl, options: [:])

                    }) {
                        Text("Support")
                    }
                    Button(action: {
                                UIApplication.shared.open(mailToFeatureRequestUrl, options: [:])
                        
                    }) {
                        Text("Feature Request")
                    }
                }
            }
        }

    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ContentView()
        }
    }
}
/*
 Button(
     action: {
         if let url = URL(string: url) {
             UIApplication.shared.open(url)
             
         }
     }) {
         Text("Directly in Safari!")
             .font(.body)
             .multilineTextAlignment(.leading)
         }
 */
