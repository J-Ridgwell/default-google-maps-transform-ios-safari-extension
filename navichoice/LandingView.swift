//
//  LandingScreen.swift
//  navichoice
//
//  Created by Zack Moss on 10/20/21.
//

import SwiftUI

struct LandingView: View {
    private let url = "https://www.navichoice.app/setup";
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("Navichoice for Safari")
                .font(.title)
                .padding(.bottom, 32)
            
            Button(action: {
                if let url = URL(string: url) {
                    UIApplication.shared.open(url)
                }
            }) {
                Text("Click here to enable NaviChoice directly in Safari!")
                    .font(.body)
                    .multilineTextAlignment(.leading)
            }
        }
        .padding()
    }
}

struct LandingView_Previews: PreviewProvider {
    static var previews: some View {
        LandingView()
    }
}
